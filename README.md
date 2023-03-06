This example represents the basic flow of how we will implement file-level bazel targets both at dev time and CI time in the web monorepo.

A few oversimplifications were made for the sake of brevity:
- deleted files are not accounted for, but those should trigger typescript and integration tests (if a source file is deleted then an integration test might fail - lint and unit tests are ok in this case)
- classifying files will need to be more complex and account for various different test directories, specific config file types, etc.
- the git command to identify changed files is not what we will use in practice. `git diff` is nicer for a playground example because you don't have to create a new commit.
- this example only deals with files that are in packages. it does not handle how we execute changes to root-level files like WORKSPACE
- this example doesn't deal with changes to libraries

To test various changes and their minimum required jobs in CI:
```
npm run test-upstream-util-change

npm run test-upstream-constant-change

npm run test-downstream-unit-test-change

npm run test-downstream-integration-test-change

npm run test-downstream-source-file-change
```

To see what would happen for the same diff footprints, but using the current CI granularity (only project-level):
```
npm run test-old-upstream-util-change

npm run test-old-upstream-constant-change

npm run test-old-downstream-unit-test-change

npm run test-old-downstream-integration-test-change

npm run test-old-downstream-source-file-change
```

We can provide the file-level dependencies to bazel by adding the following definitions to BUILD.bazel files within each project:

```
# which files are available to be imported by other projects (demonstrated in upstream-library)
exports_files([
    "src/utils.js",
    "src/constants.js"
])

# list all imports for each file (intra-project and cross-project)
filegroup(
    name = "src/use-constants.js",
    srcs = [
        '//packages/upstream-library:src/constants.js'
    ],
)
```

This is what the flow for our current CI granularity looks like: 
```
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
```

Once we have import statements represented in our build files, our new CI flow will essentially look like this:
```
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
```