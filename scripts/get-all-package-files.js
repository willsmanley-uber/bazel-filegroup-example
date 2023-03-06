import {promisify} from 'util';
import {exec} from 'child_process';
const execPromise = promisify(exec);

export const getChangedFiles = async () => {
    const {stdout} = await execPromise('git ls-tree -r master --name-only packages');
    return stdout.trim().split('\n');
} 