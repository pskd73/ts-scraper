import CoreScraper from 'app/scraper/CoreScraper';
import ImageScrapeJob from 'app/imagescraper/ImageScrapeJob';
import JobRunner from 'app/jobrunner/JobRunner';
import ImageDownloaderJob from 'app/imagescraper/ImageDownloaderJob';
import * as Lodash from 'lodash';
import * as ValidURL from 'valid-url';

class ImageScraper extends CoreScraper {

    protected imageUrls: Array<string> = []
    protected downloadJobrunner: JobRunner

    protected init(){
        this.downloadJobrunner = new JobRunner(10);
        this.downloadJobrunner.start();
    }

    protected canFetchUrl(){
        return true;
    }

    protected createJob(link){
        const job = new ImageScrapeJob(link, this);
        return job;
    }

    protected onFetchComplete(link, response){
        const imageUrls = response.parsedData;
        for(var i=0;i<imageUrls.length;i++){
            const imageUrl = imageUrls[i];
            if(this.imageUrls.indexOf(imageUrl) == -1 && ValidURL.isUri(imageUrl)){
                console.log("adding new job", imageUrl);
                this.downloadJobrunner.add(new ImageDownloaderJob(imageUrl));
                this.imageUrls.push(imageUrl);
            }
        }
    }
}

export default ImageScraper;
