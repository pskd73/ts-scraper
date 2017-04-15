import CoreJob from 'app/core/CoreJob';
import ScrapPage from 'app/core/ScrapPage';
import CoreScrapper from 'app/core/CoreScrapper';

class ScrapJob extends CoreJob {

    private scrapPage;
    private scrapper;
    private url;

    constructor(url: string, scrapper?: CoreScrapper){
        super();
        this.url = url;
        this.scrapper = scrapper;
        this.scrapPage = new ScrapPage(this.url);
    }

    async run(){
        try {
            const response = await this.scrapPage.get();
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
