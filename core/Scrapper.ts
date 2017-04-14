import JobRunner from 'app/core/JobRunner';
import Job from 'app/Job';
import ScrapperContracts from 'app/contracts/ScrapperContracts';
import * as Request from 'request';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as ParseUrl from 'parse-url';

class Scrapper implements ScrapperContracts {

    private jobrunner: JobRunner
    private initPage: string
    private scrappedPages: Array<string> = []
    private completedLinks: Array<string> = []

    constructor(initPage){
        this.initPage = initPage;
        this.jobrunner = new JobRunner(20);
        this.jobrunner.add(new Job(this, this.initPage));
        this.scrappedPages.push(this.initPage);
    }

    public onScrapResponse(links, parentLink){
        this.completedLinks.push(parentLink);
        console.log('completed link', parentLink, this.scrappedPages.length);
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

    protected canFetchUrl(url){
        const parsedUrl = ParseUrl(this.initPage);
        return url && url.indexOf(parsedUrl.resource) != -1;
    }

    protected serializeUrl(url){
        const parsedUrl = ParseUrl(url);
        return '//'+ parsedUrl.resource + parsedUrl.pathname;
    }

    public start(){
        this.jobrunner.start();
    }

}

export default Scrapper;
