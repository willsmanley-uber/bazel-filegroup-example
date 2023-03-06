export const getAllJobsForImpactedProjects = (impactedProjects) => {
    return Object.fromEntries(impactedProjects.map((impactedProject) => {
        return [impactedProject, [
            'all unit tests',
            'all integration tests',
            'typecheck',
            'all lint',
        ]]
    }))
    
    
}