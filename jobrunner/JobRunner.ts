import CoreJob from 'app/jobrunner/CoreJob';
import JobDescription from 'app/jobrunner/contracts/JobDescription';
import PriorityQue from 'app/jobrunner/contracts/PriorityQue';
import PriorityElement from 'app/jobrunner/contracts/PriorityElement';
import JobRunnerContracts from 'app/jobrunner/contracts/JobRunnerContracts';
import * as Lodash from 'lodash';

class JobRunner implements JobRunnerContracts {

    private que: Array<PriorityQue> = []
    private pipe: Array<CoreJob> = []
    private concurrentJobs: number
    private queCompletedPointer: number = -1
    private isStarted: boolean = false

    constructor(concurrentJobs) {
        this.concurrentJobs = concurrentJobs;
        for(var i=0;i<this.concurrentJobs;i++){
            this.pipe[i] = null;
        }
    }

    private getPriorites(): Array<number> {
        return Lodash.map(this.que, (priorityQ) => priorityQ.priority);
    }

    private getQueByPriority(priority: number): PriorityQue {
        for(var i=0;i<this.que.length;i++){
            const currentQueSet = this.que[i];
            if(currentQueSet.priority == priority){
                return currentQueSet;
            }
        }
        return null;
    }

    private executePipeJob(pipeIndex): void {
        const job = this.pipe[pipeIndex];
        ((pipeIndex) => {
            job.handle()
                .then(() => {
                    this.pipe[pipeIndex] = null;
                    if(this.isStarted){
                        this.appendJobs();
                    }
                });
        })(pipeIndex);
    }

    private getSortedPriorities(): Array<PriorityQue> {
        return Lodash.sortBy(this.que, [(qs) => qs.priority]).reverse();
    }

    private getNextJob(): CoreJob {
        const priorities = this.getSortedPriorities();
        for(var i=0;i<priorities.length;i++){
            const prioritySet = priorities[i];
            const nextIndex = prioritySet.index + 1;
            if(nextIndex < prioritySet.que.length){
                prioritySet.index = nextIndex;
                return prioritySet.que[prioritySet.index];
            }
        }
        return null;
    }

    private fetchNextQueElement(pipeIndex): boolean {
        const nextJob = this.getNextJob();
        let executed = false;
        if(nextJob){
            this.pipe[pipeIndex] = nextJob;
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

    private appendSingleJob() {
        for(var i=0;i<this.concurrentJobs;i++){
            if(this.pipe[i] === null){
                this.fetchNextQueElement(i);
                break;
            }
        }
    }

    private isPipeDone() {
        return Lodash.every(this.pipe, (job) => job === null);
    }

    getPipe() {
        return this.pipe;
    }

    getPendingJobs(){
        return this.que.length - this.queCompletedPointer;
    }

    getQue(){
        return this.que;
    }

    add(list) {
        if(!Array.isArray(list)){
            list = [list];
        }
        for(var i=0;i<list.length;i++){
            const job = list[i];
            const priority = job.priority;
            let queSet = this.getQueByPriority(priority);
            if(!queSet){
                queSet = {
                    priority,
                    que: [],
                    index: -1
                };
                this.que.push(queSet);
            }
            queSet.que.push(job);
        }
        if(this.isStarted){
            this.appendJobs();
        }
    }

    start(){
        this.isStarted = true;
        this.appendJobs();
    }

    next(){
        this.appendSingleJob();
    }
}

export default JobRunner;
