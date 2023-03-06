This example represents the basic flow of how we will implement file-level bazel targets both at dev time and CI time in the web monorepo.

A few oversimplifications were made for the sake of brevity:
- deleted files are not accounted for, but those should trigger typescript and integration tests (if a source file is deleted then an integration test might fail - lint and unit tests are ok in this case)
- classifying files will need to be more complex and account for various different test directories, specific config file types, etc.
- the git command to identify changed files is not what we will use in practice. `git diff` is nicer for a playground example because you don't have to create a new commit.
- this example only deals with files that are in packages. it does not handle how we execute changes to root-level files like WORKSPACE
- this example doesn't deal with changes to libraries

To test various changes and their minimum required jobs in CI:
```
npm run test-upstream-util-change

npm run test-upstream-constant-change

npm run test-downstream-unit-test-change

npm run test-downstream-integration-test-change

npm run test-downstream-source-file-change
```

We can provide the file-level dependencies to bazel by adding the following definitions to BUILD.bazel files within each project:

```
# which files are available to be imported by other projects (demonstrated in upstream-library)
exports_files([
    "src/utils.js",
    "src/constants.js"
])

# list all imports for each file (intra-project and cross-project)
filegroup(
    name = "src/use-constants.js",
    srcs = [
        '//packages/upstream-library:src/constants.js'
    ],
)
```

Once we have import statements represented in our build files, our CI flow will essentially look like this:
```
// 1) get a list of all files that were directly modified from git
getChangedFiles()
// 2) query bazel to get a list that includes all downstream files that depend on the modified files
.then(getDiffImpactedFiles)
// 3) classify those files and group them by project
.then(classifyFiles)
// 4) create a jobs list for each project based on the file classifications
.then(createJobsList)
// 5) spawn affected projects into separate buildkite sub-builds with their respective jobs
.then(spawnJobs)
```