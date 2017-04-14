import CoreJob from 'app/core/CoreJob';

interface JobDescription {
    job: CoreJob,
    pipeIndex: number,
    queIndex: number
}

export default JobDescription;
