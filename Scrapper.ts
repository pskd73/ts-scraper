import CoreScrapper from 'app/core/CoreScrapper';
import * as ParseUrl from 'parse-url';

class Scrapper extends CoreScrapper {

    protected onFetchComplete(link, completedLinks, totalScrapedLinks){
        console.log(link, completedLinks.length, totalScrapedLinks.length, this.getScrapeRate(), this.getLinkCollectRate());
    }

    protected canFetchUrl(url){
        const parsedUrl = ParseUrl(this.initPage);
        return url && url.indexOf(parsedUrl.resource) != -1;
    }

}

export default Scrapper;
