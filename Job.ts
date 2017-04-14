import CoreJob from 'app/core/CoreJob';

class Job extends CoreJob {
    async run(){
        return new Promise(function(resolve, reject){
            setTimeout(() => {
                resolve({});
            }, 2000);
        });
    }
}

export default Job;
