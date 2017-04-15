import JobResponse from 'app/jobrunner/contracts/JobResponse';

interface JobContract {
    id: number
    startTime: Date
    endTime: Date
    handle(): Promise<JobResponse>
}

export default JobContract;
