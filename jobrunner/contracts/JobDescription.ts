import CoreJob from 'app/jobrunner/CoreJob';

interface JobDescription {
    job: CoreJob,
    pipeIndex: number,
    queIndex: number
}

export default JobDescription;
