import { getPackageNameFromBazelLabel } from "./pathname-utils";

export const getChangedProjects = (changedFiles) => {
    const changedProjects = new Set();
    for(const file of changedFiles){
        changedProjects.add(getPackageNameFromBazelLabel(file));
    }
    return changedProjects;
}