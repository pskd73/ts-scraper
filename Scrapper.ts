import CoreScrapper from 'app/core/CoreScrapper';
import ScrapJob from 'app/ScrapJob';
import ScrapeResponse from 'app/contracts/ScrapResponse';
import * as ParseUrl from 'parse-url';
import * as fs from 'fs';

class Scrapper extends CoreScrapper {

    protected interestedUrls: Array<string> = []
    protected fileName: string

    protected init(){
        this.fileName = `${ParseUrl(this.initPage).resource}.out.csv`;
        this.generateCsv();
    }

    protected onFetchComplete(link, response){
        console.log('/***********************************************');
        console.log('/*', 'Completed link:', link);
        console.log('/*', 'Scrape rate:', this.getScrapeRate());
        console.log('/*', 'Link collection rate:', this.getLinkCollectRate());
        console.log('/*', 'Total completed links:', this.completedLinks.length);
        console.log('/*', 'Total links found:', this.scrappedActualPages.length);
        console.log('/*', 'Time:', new Date());
        console.log('/***********************************************');
        if(this.checkForPage(response)){
            this.updateCsv(response);
        }
    }

    protected canFetchUrl(response){
        return this.isSameSource(response);
    }

    protected createJob(link){
        const job = new ScrapJob(link, this);
        return job;
    }

    protected generateCsv(){
        fs.writeFile(this.fileName, "link\n", () => {});
    }

    protected updateCsv(response: ScrapeResponse){
        fs.appendFile(this.fileName, `${response.url}\n`, function (err) {
            if (err) throw err;
        });
    }

    protected checkForPage(response){
        const url = response.url;
        if(!this.isSameSource(response)){
            return false;
        }
        this.interestedUrls.push(url);
        return true;
    }
}

export default Scrapper;
