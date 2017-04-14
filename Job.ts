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
        return new Promise((resolve, reject) => {
            this.scrapPage.get()
                .then((links) => {
                    this.scrapper.onScrapResponse(links, this.url);
                    resolve({
                        status: true,
                        response: links
                    });
                })
        });
    }
}

export default Job;
