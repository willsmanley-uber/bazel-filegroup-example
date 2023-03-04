export const createJobsList = async (fileClassificationsGroupedByProject) => {
    return Object.entries(fileClassificationsGroupedByProject).map(([projectName, fileClassifications]) => {
        if(fileClassifications.configFiles.length){
            return [
                'all unit tests',
                'all integration tests',
                'typecheck',
            ]
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
    });
}