import { getPackageNameFromBazelLabel } from "./pathname-utils";

export const groupFilesByProject = (changedFiles, impactedFiles) => {
    let projects = {};
    const addProject = (project) => {
        if(!projects[project]) projects[project] = {
            changedFiles: [],
            impactedFiles: [],
        }
    }
    changedFiles.forEach((changedFile) => {
        const project = getPackageNameFromBazelLabel(changedFile);
        addProject(project);
        projects[project].changedFiles.push(changedFile);
    })
    impactedFiles.forEach((impactedFile) => {
        const project = getPackageNameFromBazelLabel(impactedFile);
        addProject(project);
        projects[project].impactedFiles.push(impactedFile);
    });
    return projects;
}