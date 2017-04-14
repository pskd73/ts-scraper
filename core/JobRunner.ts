import JobRunnerContracts from 'app/contracts/JobRunnerContracts';
import CoreJob from 'app/core/CoreJob';

class JobRunner implements JobRunnerContracts {

    private que: Array<CoreJob>
    private concurrentJobs: number

    constructor(concurrentJobs){
        this.concurrentJobs = concurrentJobs;
    }

    add(list){
        if(!Array.isArray(list)){
            list = [list];
        }
    }
}
