import util from 'util';

export const spawnJobs = async (jobsGroupedByProject) => {
    console.log('Jobs to spawn:')
    console.log(util.inspect(jobsGroupedByProject, {showHidden: false, depth: null, colors: true}))
}