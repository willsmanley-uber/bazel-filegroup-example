import { getChangedFiles } from "./get-changed-files.js";
import { getImpactedFiles } from "./get-impacted-files.js";
import { classifyFiles } from "./classify-files.js";
import { createJobsList } from "./create-jobs-list.js";
import { spawnJobs } from "./spawn-jobs.js";
import { groupFilesByProject } from "./group-files-by-project.js";

(async () => {
    // 1) get a list of all files that were directly modified from git
    const changedFiles = await getChangedFiles();

    // 2) query bazel to get a list that includes all downstream files that depend on the modified files
    const impactedFiles = await getImpactedFiles(changedFiles);

    // 3) group changed and impacted files by project
    const filesGroupedByProject = await groupFilesByProject(changedFiles, impactedFiles);

    // 4) add classifications to changed and impacted files
    const classifiedFilesGroupedByProject = await classifyFiles(filesGroupedByProject);

    // 5) create jobs list for each project
    const jobsList = await createJobsList(classifiedFilesGroupedByProject);

    // 5) spawn jobs to buildkite
    await spawnJobs(jobsList);
})()