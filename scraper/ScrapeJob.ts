import CoreJob from 'app/jobrunner/CoreJob';
import PageScraper from 'app/scraper/PageScraper';
import CoreScraper from 'app/scraper/CoreScraper';

abstract class ScrapeJob extends CoreJob {

    protected scrapPage;
    protected scrapper;
    protected url;

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
