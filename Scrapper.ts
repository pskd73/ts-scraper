import CoreScrapper from 'app/core/CoreScrapper';
import * as ParseUrl from 'parse-url';
import * as fs from 'fs';

class Scrapper extends CoreScrapper {

    protected interestedUrls: Array<string> = []

    protected generateCsv(links: Array<string>){
        const string = links.join('\n');
        fs.writeFile("./out.csv", string, () => {});
    }

    protected onFetchComplete(link, response){
        console.log('/***********************************************');
        console.log('/*', 'Completed link:', link);
        console.log('/*', 'Scrape rate:', this.getScrapeRate());
        console.log('/*', 'Link collection rate:', this.getLinkCollectRate());
        console.log('/*', 'Total completed links:', this.completedLinks.length);
        console.log('/*', 'Total links found:', this.scrappedActualPages.length);
        console.log('/*', 'Que length:', this.jobrunner.getPendingJobs());
        console.log('/*', 'Time:', new Date());
        console.log('/***********************************************');
        if(this.checkForPage(response)){
            this.generateCsv(this.interestedUrls);
        }
    }

    protected canFetchUrl(url, response){
        const parsedUrl = ParseUrl(this.initPage);
        return url && url.indexOf(parsedUrl.resource) != -1
    }

    protected checkForPage(response){
        const url = response.url;
        const videoMatches = url.match(/\/video[\d]*\//g);
        if(!(videoMatches && videoMatches.length)){
            return false;
        }
        const indiaMatches = url.match(/india/g);
        if(!(indiaMatches && indiaMatches.length)){
            return false;
        }
        if(this.interestedUrls.indexOf(url) != -1){
            return false;
        }
        this.interestedUrls.push(url);
        return true;
    }
}

export default Scrapper;
