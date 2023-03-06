import {promisify} from 'util';
import {exec} from 'child_process';
import {filenameToBazelLabel} from './pathname-utils.js';
const execPromise = promisify(exec);

export const getChangedFiles = async () => {
    const {stdout} = await execPromise('git diff --name-only packages');
    return stdout.trim().split('\n').filter(Boolean).map(filenameToBazelLabel);
} 