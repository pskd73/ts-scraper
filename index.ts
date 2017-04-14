import JobRunner from 'app/core/JobRunner';
import Job from 'app/Job';

const jobRunner = new JobRunner(5);
for(var i=0;i<10;i++){
    const job = new Job();
    jobRunner.add(job);
}

jobRunner.start();
