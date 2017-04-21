import { CoreJob } from "ts-jobrunner";
import CoreScraper from "./CoreScraper";
import PageScraper from "./PageScraper";

abstract class ScrapeJob extends CoreJob {

    protected scrapPage: PageScraper;
    protected scrapper: CoreScraper;
    protected url: string;

    constructor(url: string, scrapper?: CoreScraper) {
        super();
        this.url = url;
        this.scrapper = scrapper;
        this.scrapPage = this.createPageScraper(this.url);
    }

    public async run() {
        try {
            const response = await this.scrapPage.start();
            if (this.scrapper) {
                this.scrapper.onScrapResponse(response, this.url);
            }
            return {
                response,
                status: true,
            };
        } catch (e) {
            return {
                response: e,
                status: false,
            };
        }
    }

    protected abstract createPageScraper(url: string): PageScraper;
}

export default ScrapeJob;
