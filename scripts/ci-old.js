import { getChangedFiles } from "./get-changed-files.js";
import { spawnJobs } from "./spawn-jobs.js";
import { getAllJobsForImpactedProjects } from "./get-all-jobs-for-impacted-projects.js";
import { getChangedProjects } from "./get-changed-projects.js";
import { getDiffImpactedProjects } from "./get-diff-impacted-projects.js";

(async () => {
    // 1) get a list of all files that were directly modified from git
    const changedFiles = await getChangedFiles();

    // 2) get a list of projects that included file changes
    const changedProjects = await getChangedProjects(changedFiles);

    // 3) query bazel to get a list that includes all downstream projects that depend on the modified projects
    const impactedProjects = await getDiffImpactedProjects(changedProjects);

    // 4) get all jobs in impacted projects
    const jobsList = await getAllJobsForImpactedProjects(impactedProjects);

    // 5) spawn jobs to buildkite
    await spawnJobs(jobsList);
})()