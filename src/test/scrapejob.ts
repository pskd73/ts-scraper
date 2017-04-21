import { expect } from "chai";
import "mocha";
import TestScrapeJob from "./test-scraper/TestScrapeJob";

describe("ScrapeJob", () => {

    const scrapeJob = new TestScrapeJob("http://google.com");

    it("should create ScrapeJob", () => {
        return expect(scrapeJob).to.be.ok;
    });

    it("should run the scrapejob", async () => {
        const response = await scrapeJob.run();
        const t1 = expect(response.status).to.be.ok;
    }).timeout(1000 * 60 * 2);

    it("should scrape links", async () => {
        const response = await scrapeJob.run();
        const t1 = expect(response.response.links.length).to.be.ok;
    }).timeout(1000 * 60 * 2);
});
