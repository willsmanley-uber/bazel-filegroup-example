import fs from 'fs';
import { init, parse } from 'es-module-lexer';
import {resolve} from 'path';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

// hack bc we are using node module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const getPackageTargetFromFile = (file) => {
    const relative = path.relative(root, file);
    const packageTarget = '//' + relative.split('/')[0] + '/' + relative.split('/')[1]
    return packageTarget;
  };

  const isIntraPackage = (file1, file2) => {
    return getPackageTargetFromFile(file1) === getPackageTargetFromFile(file2);
  }

  const getPathFromPackageRoot = (file) => {
    const path = file.split(getPackageTargetFromFile(file).replace('//',''))[1].slice(1);
    return path;
  }

const parsePackage = async (pkg) => {
    await init;

    const packageDir = `packages/${pkg}`;
    const packageDirAbsolute = path.resolve(packageDir);
    const files = (await getFiles(packageDir))
      .filter(x => x.endsWith('.js'))
      .map(file => {
          const source = fs.readFileSync(file);
          return {
              file,
              code: source.toString(),
          };
      }).map((sourceObject) => {
          const [imports, exports, isFacade] = parse(sourceObject.code, sourceObject.file);
          // hack - we can detect workspace references with @uber or other method more accurately
          const workspaces = ['upstream-library', 'downstream-application', 'upstream-index-reexport'];
          return {
            imports: imports.map((importObject) => {
                const isWorkspace = workspaces.filter((workspace) => {
                    return importObject.n.startsWith(workspace);
                }).length > 0;
                return {
                    ...importObject,
                    n: isWorkspace ? path.resolve(root, 'packages', importObject.n) : path.resolve(sourceObject.file, '..', importObject.n)
                }
            }),
            exports,
            isFacade,
            file: sourceObject.file,
          }
      });

      let buildFileContent = '';

      // just export all files for simplicity. may be necessary / more performant in real implementation to filter down to fewer files.
      let exportedFiles = files.map((file) => file.file.replace(packageDirAbsolute + '/', ''));
      let exportedFilesCall = 'exports_files(' + JSON.stringify(exportedFiles) + ')\n\n';
      buildFileContent += exportedFilesCall;

      files.forEach((file) => {
        let fileGroupSrcs = JSON.stringify(
            file.imports.map((importStatement) => importStatement.n).map((filePath) => {
                if(isIntraPackage(filePath, file.file)){
                    return ':' + getPathFromPackageRoot(filePath);
                }else{
                    return getPackageTargetFromFile(filePath) + ':' + getPathFromPackageRoot(filePath);
                }
            })
        );
        buildFileContent += `filegroup(name = "${file.file.replace(packageDirAbsolute + '/', '')}", srcs = ${fileGroupSrcs})\n\n`;
      });

      fs.writeFileSync(`${packageDir}/BUILD.bazel`, buildFileContent);
}

const parseAllPackages = async () => {
    (await fs.promises.readdir('packages', { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .forEach(parsePackage);
}

parseAllPackages();