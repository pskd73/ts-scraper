import ScrapeJob from 'app/scraper/ScrapeJob';
import ImagePageScraper from 'app/imagescraper/ImagePageScraper';

class ImageScrapeJob extends ScrapeJob {

    protected createPageScraper(url){
        return new ImagePageScraper(url);
    }
}

export default ImageScrapeJob;
