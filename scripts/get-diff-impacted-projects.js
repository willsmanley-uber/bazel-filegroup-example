import {getPackageNameFromBazelLabel} from './pathname-utils';
import {promisify} from 'util';
import {exec} from 'child_process';
const execPromise = promisify(exec);

// this is not how we actually determine impacted projects today in web-code, 
// it is a little hack using all file dependencies in the project
export const getDiffImpactedProjects = async (changedProjects) => {
    let impactedProjects = new Set();
    for(const project of changedProjects){
        const {stdout} = await execPromise(`git ls-tree -r master --name-only ${getPackageNameFromBazelLabel(project)}`);
        const allFiles = stdout.trim().split('\n').filter(Boolean);
        for(const file of allFiles){
            const {stdout} = await execPromise(`bazel query 'rdeps(..., ${file})'`);
            stdout.trim().split('\n').filter(Boolean).forEach((impactedFile) => {
                impactedProjects.add(getPackageNameFromBazelLabel(impactedFile));
            })   
        }
    }
    return Array.from(impactedProjects);
} 