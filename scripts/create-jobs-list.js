export const createJobsList = async (fileClassificationsGroupedByProject) => {
    return Object.fromEntries(Object.entries(fileClassificationsGroupedByProject).map(([projectName, fileClassifications]) => {
        // always run typecheck
        let jobs = ['typecheck'];

        // run lint only on directly changed files
        if(Object.values(fileClassifications.changedFiles).length){
            jobs.push({
                lint: Object.values(fileClassifications.changedFiles).flat()
            })
        }

        // if a config file is impacted, run all tests on the project
        if(fileClassifications.configFiles.length){
            return [projectName, jobs.concat([
                'all unit tests',
                'all integration tests',
            ])]
        }

        // if some unit tests have been impacted, selectively run those
        if(fileClassifications.unitTestFiles.length){
            jobs.push({
                'some unit tests': fileClassifications.unitTestFiles
            })
        }

        // if a source code file has been impacted, we have to run all unit tests
        // otherwise only run selective unit tests if they have been impacted
        if(fileClassifications.sourceCodeFiles.length){
            jobs.push('all integration tests')
        } else if(fileClassifications.integrationTestFiles.length){
            jobs.push({
                'some integration tests': fileClassifications.integrationTestFiles
            })
        }

        return [projectName, jobs];
    })); 
}