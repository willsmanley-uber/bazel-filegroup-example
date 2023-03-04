export const getPackageNameFromBazelLabel = (label) => {
    return label.split(':')[0].replace('//', '');
}

export const filenameToBazelLabel = (filename) => {
    const components = filename.split('/');
    const project = `${components[0]}/${components[1]}`;
    const file = filename.split(project + '/')[1];
    return `//${project}:${file}`;
}