export const createJobsList = async (fileClassificationsGroupedByProject) => {
    return Object.fromEntries(Object.entries(fileClassificationsGroupedByProject).map(([projectName, fileClassifications]) => {
        if(fileClassifications.configFiles.length){
            return [projectName, [
                'all unit tests',
                'all integration tests',
                'typecheck',
            ]]
        }

        let jobs = [
            'typecheck'
        ];
        if(fileClassifications.unitTestFiles.length){
            jobs.push({
                'some unit tests': fileClassifications.unitTestFiles
            })
        }

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