import CoreJob from 'app/core/CoreJob';

interface JobRunnerContracts {
    add(list: Array<CoreJob>|CoreJob): void
    start(): void
}

export default JobRunnerContracts;
