import {promisify} from 'util';
import {exec} from 'child_process';
const execPromise = promisify(exec);

export const getChangedFiles = async (): Promise<Array<string>> => {
    const {stdout} = await execPromise('git diff-tree --no-commit-id --name-only -r HEAD origin/master');
    return JSON.parse(stdout);
}