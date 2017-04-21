import * as jquery from "jquery";
import * as jsdom from "jsdom";
import * as ParseUrl from "parse-url";
import * as Request from "request";
import { CoreJob, JobRunner } from "ts-jobrunner";
import ScrapResponse from "./contracts/ScrapeResponse";
import ScrapperContracts from "./contracts/ScrapperContracts";

abstract class CoreScraper implements ScrapperContracts {

    protected initPage: string;
    protected scrappedPages: string[] = [];
    protected completedLinks: string[] = [];
    protected scrappedActualPages: string[] = [];
    protected concurrentConnections: number;
    protected startTime: Date;
    protected stickToRootSource: boolean = true;
    private jobrunner: JobRunner;

    constructor(initPage: string, concurrentConnections: number = 5) {
        this.initPage = initPage;
        this.concurrentConnections = concurrentConnections;
        this.jobrunner = new JobRunner(this.concurrentConnections);
        this.jobrunner.add(this.createJob(this.initPage));
        this.scrappedPages.push(this.initPage);
        this.init();
    }

    public onScrapResponse(response: ScrapResponse, parentLink: string) {
        this.completedLinks.push(parentLink);
        this.onFetchComplete(parentLink, response);
        const links = response.links;
        for (const actualLink of links) {
            if (actualLink) {
                const parsedLink = this.serializeUrl(actualLink);
                if (this.scrappedPages.indexOf(parsedLink) === -1) {
                    let allowFromSource = true;
                    if (this.stickToRootSource) {
                        allowFromSource = this.isSameSource(actualLink);
                    }
                    if (allowFromSource && this.canFetchUrl(actualLink)) {
                        const job = this.createJob(actualLink);
                        this.jobrunner.add(job);
                    }
                    this.scrappedPages.push(parsedLink);
                    this.scrappedActualPages.push(actualLink);
                }
            }
        }
    }

    public getDiffTime() {
        const now = new Date();
        return now.getTime() - this.startTime.getTime();
    }

    public getScrapeRate() {
        const diff = this.getDiffTime();
        return (this.completedLinks.length / diff) * 1000;
    }

    public getLinkCollectRate() {
        const diff = this.getDiffTime();
        return (this.scrappedPages.length / diff) * 1000;
    }

    public start() {
        this.startTime = new Date();
        this.jobrunner.start();
    }

    protected serializeUrl(url) {
        const parsedUrl = ParseUrl(url);
        return "//" + parsedUrl.resource + parsedUrl.pathname;
    }

    protected getPriorityForLink(link: string): number {
        return 10;
    }

    protected isSameSource(url: string): boolean {
        const parsedUrl = ParseUrl(this.initPage);
        return url && url.indexOf(parsedUrl.resource) !== -1;
    }

    protected doesUrlContain(response: ScrapResponse, regex: RegExp): boolean {
        const matches = response.url.match(regex);
        return !!(matches && matches.length);
    }

    protected abstract onFetchComplete(link: string, response: ScrapResponse);
    protected abstract canFetchUrl(url: string): boolean;
    protected abstract createJob(link: string): CoreJob;
    protected abstract init(): void;

}

export default CoreScraper;
