export const classifyFiles = async (filesGroupedByProject)  => {
    return Object.fromEntries(Object.entries(filesGroupedByProject).map(([projectName, {changedFiles, impactedFiles}]) => {
        const fileClassifications = {
            // keep directly changed files so that we know what to lint
            changedFiles,
            unitTestFiles: [],
            integrationTestFiles: [],
            sourceCodeFiles: [],
            configFiles: [],
        };

        for(const file of impactedFiles){
            // overly simplistic example of classifying files based on pathname to determine which tests need to be run
            if(file.match(/__integration__/)){
                fileClassifications.integrationTestFiles.push(file);
            } else if(file.match(/__tests__/)) {
                fileClassifications.unitTestFiles.push(file);
            } else if(file.match(/src/)){
                fileClassifications.sourceCodeFiles.push(file);
            } else {
                fileClassifications.configFiles.push(file);
            }
        }

        return [projectName, fileClassifications];
    }));
}