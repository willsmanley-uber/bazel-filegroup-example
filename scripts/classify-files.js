import { getPackageNameFromBazelLabel } from "./pathname-utils";

export const classifyFiles = async (files)  => {
    const fileClassificationsGroupedByProject = {};
    files.forEach((file) => {
        // file classifications only really matter at the project level, so we can group them
        const project = getPackageNameFromBazelLabel(file);
        if(!fileClassificationsGroupedByProject[project]){
            fileClassificationsGroupedByProject[project] = {
                unitTestFiles: [],
                integrationTestFiles: [],
                sourceCodeFiles: [],
                configFiles: [],
            };
        }

        // overly simplistic example of classifying files based on pathname to determine which tests need to be run
        if(file.match(/__integration__/)){
            fileClassificationsGroupedByProject[project].integrationTestFiles.push(file);
        } else if(file.match(/__tests__/)) {
            fileClassificationsGroupedByProject[project].unitTestFiles.push(file);
        } else if(file.match(/src/)){
            fileClassificationsGroupedByProject[project].sourceCodeFiles.push(file);
        } else {
            fileClassificationsGroupedByProject[project].configFiles.push(file);
        }
    });

    return fileClassificationsGroupedByProject;
}