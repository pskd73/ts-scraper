import ScrapeJob from 'app/scraper/ScrapeJob';
import LinkPageScraper from 'app/linkscraper/LinkPageScraper';

class LinkScrapeJob extends ScrapeJob {

    protected createPageScraper(url){
        return new LinkPageScraper(url);
    }

}

export default LinkScrapeJob;
