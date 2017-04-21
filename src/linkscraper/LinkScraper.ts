import * as fs from "fs";
import * as ParseUrl from "parse-url";
import ScrapeResponse from "../contracts/ScrapResponse";
import CoreScraper from "../CoreScraper";
import LinkScrapeJob from "./LinkScrapeJob";

class Scrapper extends CoreScraper {

    protected interestedUrls: string[] = [];
    protected fileName: string;

    protected init() {
        this.fileName = `${ParseUrl(this.initPage).resource}.out.csv`;
        this.generateCsv();
    }

    protected onFetchComplete(link, response) {
        // console.log("/***********************************************");
        // console.log("/*", "Completed link:", link);
        // console.log("/*", "Scrape rate:", this.getScrapeRate());
        // console.log("/*", "Link collection rate:", this.getLinkCollectRate());
        // console.log("/*", "Total completed links:", this.completedLinks.length);
        // console.log("/*", "Total links found:", this.scrappedActualPages.length);
        // console.log("/*", "Time:", new Date());
        // console.log("/***********************************************");
        if (this.checkForPage(response)) {
            this.updateCsv(response);
        }
    }

    protected canFetchUrl(url) {
        return true;
    }

    protected createJob(link) {
        const job = new LinkScrapeJob(link, this);
        return job;
    }

    protected generateCsv() {
        fs.writeFile(this.fileName, "link\n", () => {
            return;
        });
    }

    protected updateCsv(response: ScrapeResponse) {
        fs.appendFile(this.fileName, `${response.url}\n`, (err) => {
            if (err) {
                throw err;
            }
        });
    }

    protected checkForPage(response) {
        const url = response.url;
        if (!this.isSameSource(response.url)) {
            return false;
        }
        this.interestedUrls.push(url);
        return true;
    }
}

export default Scrapper;
