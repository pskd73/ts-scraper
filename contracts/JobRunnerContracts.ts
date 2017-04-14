import CoreJob from 'app/core/CoreJob';

interface JobRunnerContracts {
    add(list: Array<CoreJob>|CoreJob): void
}

export default JobRunnerContracts;
