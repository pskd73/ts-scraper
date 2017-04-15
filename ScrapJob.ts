import CoreJob from 'app/jobrunner/CoreJob';
import LinkPageScraper from 'app/LinkPageScraper';
import CoreScraper from 'app/scraper/CoreScraper';

class ScrapJob extends CoreJob {

    private scrapPage;
    private scrapper;
    private url;

    constructor(url: string, scrapper?: CoreScraper){
        super();
        this.url = url;
        this.scrapper = scrapper;
        this.scrapPage = new LinkPageScraper(this.url);
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
}

export default ScrapJob;
