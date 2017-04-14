import JobRunnerContracts from 'app/contracts/JobRunnerContracts';
import CoreJob from 'app/core/CoreJob';
import JobDescription from 'app/contracts/JobDescription';
import * as Lodash from 'lodash';

class JobRunner implements JobRunnerContracts {

    private que: Array<CoreJob> = []
    private pipe: Array<number> = []
    private concurrentJobs: number
    private queCompletedPointer: number = -1

    constructor(concurrentJobs) {
        this.concurrentJobs = concurrentJobs;
        for(var i=0;i<this.concurrentJobs;i++){
            this.pipe[i] = null;
        }
    }

    private executePipeJob(pipeIndex): void {
        const job = this.que[this.pipe[pipeIndex]];
        ((pipeIndex) => {
            job.handle()
                .then(() => {
                    this.fetchNextQueElement(pipeIndex);
                });
        })(pipeIndex);
    }

    private fetchNextQueElement(pipeIndex): boolean {
        const nextQueIndex = this.queCompletedPointer + 1;
        let executed = false;
        if(nextQueIndex < this.que.length){
            this.pipe[pipeIndex] = nextQueIndex;
            this.queCompletedPointer++;
            this.executePipeJob(pipeIndex);
            executed = true;
        }else{
            this.pipe[pipeIndex] = null;
        }
        return executed;
    }

    private appendJobs() {
        for(var i=0;i<this.concurrentJobs;i++){
            if(this.pipe[i] === null){
                this.fetchNextQueElement(i);
            }
        }
    }

    private isPipeDone() {
        return Lodash.every(this.pipe, (job) => job === null);
    }

    add(list) {
        this.que = Lodash.concat(this.que, list);
        if(this.isPipeDone()){
            this.appendJobs();
        }
    }

    start(){
        this.appendJobs();
    }
}

export default JobRunner;
