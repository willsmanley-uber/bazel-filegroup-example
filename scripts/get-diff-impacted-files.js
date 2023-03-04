import {promisify} from 'util';
import {exec} from 'child_process';
import { filenameToBazelLabel } from './pathname-utils';
const execPromise = promisify(exec);

export const getDiffImpactedFiles = async (changedFiles) => {
    const diffImpactedFiles = new Set();
    for(const file of changedFiles){
        const label = filenameToBazelLabel(file);
        const {stdout} = await execPromise(`bazel query 'rdeps(..., ${label})'`);
        stdout.split('\n').forEach((file) => {
            console.log(file);
            diffImpactedFiles.add(file);
        })   
    }
    return diffImpactedFiles;
} 