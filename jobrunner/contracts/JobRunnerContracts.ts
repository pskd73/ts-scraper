import CoreJob from 'app/jobrunner/CoreJob';

interface JobRunnerContracts {
    add(list: Array<CoreJob>|CoreJob): void
    getPendingJobs(): number
    start(): void
}

export default JobRunnerContracts;
