import ScrapeJob from '../ScrapeJob';
import LinkPageScraper from './LinkPageScraper';

class LinkScrapeJob extends ScrapeJob {

    protected createPageScraper(url){
        return new LinkPageScraper(url);
    }

}

export default LinkScrapeJob;
