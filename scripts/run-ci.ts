import { getChangedFiles } from "./get-changed-files";

const runCi = async () => {
    // 1) get diff'd files
    const changedFiles = await getChangedFiles();

    // 2) query bazel to get unique rdeps of diff'd files
    

    // 3) classify files by type and group them into projects


    // 4) create a list of essential jobs for each project


    // 5) spawn jobs (just output job list to stdout for this example)

}

runCi();