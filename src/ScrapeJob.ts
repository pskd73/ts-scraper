import { CoreJob } from 'ts-jobrunner';
import PageScraper from './PageScraper';
import CoreScraper from './CoreScraper';

abstract class ScrapeJob extends CoreJob {

    protected scrapPage: PageScraper;
    protected scrapper: CoreScraper;
    protected url: string;

    constructor(url: string, scrapper?: CoreScraper){
        super();
        this.url = url;
        this.scrapper = scrapper;
        this.scrapPage = this.createPageScraper(this.url);
    }

    async run(){
        try {
            const response = await this.scrapPage.start();
            if(this.scrapper){
                this.scrapper.onScrapResponse(response, this.url);
            }
            return {
                status: true,
                response: response
            };
        }catch(e){
            console.log(e);
        }
    }

    protected abstract createPageScraper(url: string): PageScraper
}

export default ScrapeJob;
