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
        if(fileClassifications.testFiles.length){
            jobs.push({
                'some unit tests': fileClassifications.testFiles
            })
        }
        if(fileClassifications.sourceCodeFiles){
            jobs.push('all integration tests')
        }

        return [projectName, jobs];
    })); 
}