import JobRunner from 'app/jobrunner/JobRunner';
import CoreJob from 'app/jobrunner/CoreJob';
import ScrapperContracts from 'app/scraper/contracts/ScrapperContracts';
import ScrapResponse from 'app/scraper/contracts/ScrapResponse';
import * as Request from 'request';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as ParseUrl from 'parse-url';

abstract class CoreScraper implements ScrapperContracts {

    protected jobrunner: JobRunner
    protected initPage: string
    protected scrappedPages: Array<string> = []
    protected completedLinks: Array<string> = []
    protected scrappedActualPages: Array<string> = []
    protected concurrentConnections: number
    protected startTime: Date
    protected stickToRootSource: boolean = true

    constructor(initPage: string, concurrentConnections: number = 5){
        this.initPage = initPage;
        this.concurrentConnections = concurrentConnections;
        this.jobrunner = new JobRunner(this.concurrentConnections);
        this.jobrunner.add(this.createJob(this.initPage));
        this.scrappedPages.push(this.initPage);
        this.init();
    }

    protected onScrapResponse(response, parentLink){
        this.completedLinks.push(parentLink);
        this.onFetchComplete(parentLink, response);
        const links = response.links;
        for(var i=0;i<links.length;i++){
            const actualLink = links[i];
            if(actualLink){
                const parsedLink = this.serializeUrl(actualLink);
                if(this.scrappedPages.indexOf(parsedLink) == -1){
                    let allowFromSource = true;
                    if(this.stickToRootSource){
                        allowFromSource = this.isSameSource(actualLink);
                    }
                    if(allowFromSource && this.canFetchUrl(actualLink)){
                        const job = this.createJob(actualLink);
                        this.jobrunner.add(job);
                    }
                    this.scrappedPages.push(parsedLink);
                    this.scrappedActualPages.push(actualLink);
                }
            }
        }
    }

    protected serializeUrl(url){
        const parsedUrl = ParseUrl(url);
        return '//'+ parsedUrl.resource + parsedUrl.pathname;
    }

    public getDiffTime(){
        const now = new Date();
        return now.getTime() - this.startTime.getTime();
    }

    public getScrapeRate(){
        const diff = this.getDiffTime();
        return (this.completedLinks.length/diff)*1000;
    }

    public getLinkCollectRate(){
        const diff = this.getDiffTime();
        return (this.scrappedPages.length/diff)*1000;
    }

    protected getPriorityForLink(link: string): number {
        return 10;
    }

    protected isSameSource(url: string): boolean {
        const parsedUrl = ParseUrl(this.initPage);
        return url && url.indexOf(parsedUrl.resource) != -1;
    }

    protected doesUrlContain(response: ScrapResponse, regex: RegExp): boolean{
        const matches = response.url.match(regex);
        return !!(matches && matches.length);
    }

    protected abstract onFetchComplete(link: string, response: ScrapResponse)
    protected abstract canFetchUrl(url: string): boolean
    protected abstract createJob(link: string): CoreJob
    protected abstract init(): void

    public start(){
        this.startTime = new Date();
        this.jobrunner.start();
    }

}

export default CoreScraper;
