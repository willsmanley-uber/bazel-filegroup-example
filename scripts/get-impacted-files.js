import {promisify} from 'util';
import {exec} from 'child_process';
const execPromise = promisify(exec);

export const getImpactedFiles = async (changedFiles) => {
    if(!changedFiles) return [];

    const impactedFiles = new Set();
    for(const changedFile of changedFiles){
        const {stdout} = await execPromise(`bazel query 'rdeps(..., ${changedFile})'`);
        stdout.trim().split('\n').filter(Boolean).forEach((impactedFile) => {
            impactedFiles.add(impactedFile);
        })   
    }
    return impactedFiles;
} 