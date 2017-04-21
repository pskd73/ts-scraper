import * as fs from "fs";
import * as ParseUrl from "parse-url";
import ScrapeResponse from "../../contracts/ScrapResponse";
import CoreScraper from "../../CoreScraper";
import TestScrapeJob from "./TestScrapeJob";

class Scrapper extends CoreScraper {

    protected interestedUrls: string[] = [];

    protected init() {
        return;
    }

    protected onFetchComplete(link, response) {
        this.interestedUrls.push(link);
    }

    protected canFetchUrl(url) {
        return true;
    }

    protected createJob(link) {
        return new TestScrapeJob(link, this);
    }
}

export default Scrapper;
