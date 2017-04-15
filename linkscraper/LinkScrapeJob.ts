import ScrapeJob from 'app/scraper/ScrapeJob';
import LinkPageScraper from 'app/linkscraper/LinkPageScraper';
import CoreScraper from 'app/scraper/CoreScraper';

class LinkScrapeJob extends ScrapeJob {

    protected createPageScraper(url){
        return new LinkPageScraper(url);
    }

}

export default LinkScrapeJob;
