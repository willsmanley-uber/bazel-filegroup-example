import { getChangedFiles } from "./get-changed-files.js";
import { getDiffImpactedFiles } from "./get-diff-impacted-files.js";
import { classifyFiles } from "./classify-files.js";
import { createJobsList } from "./create-jobs-list.js";
import { spawnJobs } from "./spawn-jobs.js";

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