import { expect } from "chai";
import "mocha";
import TestPageScraper from "./test-scraper/TestPageScraper";

describe("PageScraper", () => {

    const pageScraper = new TestPageScraper("http://google.com");

    it("should create PageScraper", () => {
        return expect(pageScraper).to.be.ok;
    });

    it("should get response from promiseRequest", async () => {
        const response = await pageScraper.start();
        const t1 = expect(response.body).to.be.ok;
        const t2 = expect(response.links.length).to.be.ok;
    }).timeout(1000 * 60 * 2);

    it("should contain jquery object", () => {
        const t1 = expect(pageScraper.jQueryObject).to.be.ok;
    });

    it("should have atleast one <body> element", () => {
        const body = pageScraper.jQueryObject.find("body");
        const t1 = expect(body.length).to.be.ok;
    });
});
