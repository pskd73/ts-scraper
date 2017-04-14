import CoreJob from 'app/core/CoreJob';
import ScrapPage from 'app/core/ScrapPage';

class Job extends CoreJob {

    private scrapPage;
    private scrapper;
    private url;

    constructor(scrapper, url){
        super();
        this.url = url;
        this.scrapper = scrapper;
        this.scrapPage = new ScrapPage(this.url);
    }

    async run(){
        const response = await this.scrapPage.get();
        this.scrapper.onScrapResponse(response.links, this.url);
        return {
            status: true,
            response: response
        };
    }
}

export default Job;
