export const classifyFiles = (files: Array<string>)  => {
    const fileClassificationsGroupedByProject = {};
    files.forEach((file) => {
        // file classifications only really matter at the project level, so we can group them
        const project = getProjectFromFile(file);
        if(!fileClassificationsGroupedByProject[project]){
            fileClassificationsGroupedByProject[project] = {
                testFiles: [],
                sourceCodeFiles: [],
                configFiles: [],
            };
        }

        // overly simplistic example of classifying files based on pathname to determine which tests need to be run
        if(file.match(/(\/__integration__\/|\/__tests__\/)/)){
            fileClassificationsGroupedByProject[project].testFiles.push(file);
        } else if(file.match(/src/)){
            fileClassificationsGroupedByProject[project].sourceCodeFiles.push(file);
        } else {
            fileClassificationsGroupedByProject[project].configFiles.push(file);
        }
    })
}

const getProjectFromFile = (file: string): string => {
    return 'downstream-application';
}