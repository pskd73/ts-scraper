import JobRunner from 'app/core/JobRunner';
import Job from 'app/Job';
import ScrapperContracts from 'app/contracts/ScrapperContracts';
import * as Request from 'request';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as ParseUrl from 'parse-url';

abstract class CoreScrapper implements ScrapperContracts {

    protected jobrunner: JobRunner
    protected initPage: string
    protected scrappedPages: Array<string> = []
    protected completedLinks: Array<string> = []
    protected concurrentConnections: number
    protected startTime: Date

    constructor(initPage: string, concurrentConnections: number = 5){
        this.initPage = initPage;
        this.concurrentConnections = concurrentConnections;
        this.jobrunner = new JobRunner(this.concurrentConnections);
        this.jobrunner.add(new Job(this, this.initPage));
        this.scrappedPages.push(this.initPage);
    }

    protected onScrapResponse(links, parentLink){
        this.completedLinks.push(parentLink);
        this.onFetchComplete(parentLink, this.completedLinks, this.scrappedPages);
        for(var i=0;i<links.length;i++){
            const actualLink = links[i];
            const parsedLink = this.serializeUrl(actualLink);
            if(this.scrappedPages.indexOf(parsedLink) == -1){
                if(this.canFetchUrl(parsedLink)){
                    this.jobrunner.add(new Job(this, actualLink));
                }
                this.scrappedPages.push(parsedLink);
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

    protected abstract onFetchComplete(link: string, completedLinks: Array<string>, totalScrapedLinks: Array<string>)

    protected abstract canFetchUrl(url: string): boolean

    public start(){
        this.startTime = new Date();
        this.jobrunner.start();
    }

}

export default CoreScrapper;
