import JobContract from 'app/contracts/JobContract';
import JobResponse from 'app/contracts/JobResponse';
import JobStates from 'app/contracts/JobStates';
import * as uniqid from 'uniqid';

abstract class CoreJob implements JobContract {

    public id
    public startTime
    public endTime
    public state: JobStates
    public response: JobResponse

    constructor() {
        this.id = uniqid();
        this.startTime = new Date();
        this.state = JobStates.PENDING;
    }

    async handle(){
        this.state = JobStates.RUNNING;
        this.response = await this.run();
        this.endTime = new Date();
        this.state = JobStates.COMPLETED;
        return this.response;
    }

    abstract async run(): Promise<JobResponse>
}

export default CoreJob;
