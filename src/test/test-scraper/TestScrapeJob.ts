import ScrapeJob from "../../ScrapeJob";
import TestPageScraper from "./TestPageScraper";

class TestScrapeJob extends ScrapeJob {

    protected createPageScraper(url) {
        return new TestPageScraper(url);
    }

}

export default TestScrapeJob;
