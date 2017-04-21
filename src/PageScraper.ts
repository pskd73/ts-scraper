import * as jquery from "jquery";
import * as jsdom from "jsdom";
import * as Lodash from "lodash";
import * as ParseUrl from "parse-url";
import * as Request from "request";
import PageScraperContract from "./contracts/PageScraperContract";
import ScrapeResponse from "./contracts/ScrapResponse";

abstract class PageScraper implements PageScraperContract {

    public url: string;
    public response: ScrapeResponse;
    public body: string;
    public links: string[] = [];

    constructor(url: string) {
        this.url = url;
    }

    public async start() {
        const {body, response} = await this.promiseRequest();
        this.response = response;
        this.body = body;
        const jQuery = await this.getJquery();
        this.links = this.parseLinks(jQuery);
        const parsedData = await this.parse(jQuery);
        return {
            body: this.body,
            links: this.links,
            parsedData,
            response: this.response,
            url: this.url,
        };
    }

    public abstract parse(jquery: JQuery): any;

    private async getJquery(): Promise<JQuery> {
        let $ = null;
        if (this.body) {
            const window = await this.promiseJsdom(this.body);
            $ = jquery(window);
        }
        return $;
    }

    private parseLinks($): string[] {
        const anchors = $("a");
        const links = [];
        for (const anchor of anchors) {
            let href = anchor.href;
            if (href[0] === "/") {
                const parsedUrl = ParseUrl(this.url);
                href = parsedUrl.protocol + "://" + parsedUrl.resource + href;
            }
            links.push(href);
        }
        return links;
    }

    protected promiseRequest(): Promise<any> {
        return new Promise((resolve, reject) => {
            Request(this.url, (err, response, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({response, body});
                }
            });
        });
    }

    protected promiseJsdom(body: string): Promise<object> {
        return new Promise((resolve, reject) => {
            jsdom.env(body, (err, window) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(window);
                }
            });
        });
    }

}

export default PageScraper;
