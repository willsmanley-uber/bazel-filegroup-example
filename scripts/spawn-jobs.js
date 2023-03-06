import util from 'util';

export const spawnJobs = async (jobsGroupedByProject) => {
    console.log(util.inspect(jobsGroupedByProject, {showHidden: false, depth: null, colors: true}))
}