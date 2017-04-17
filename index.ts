import ImageScraper from 'app/imagescraper/ImageScraper';
import LinkScraper from 'app/linkscraper/LinkScraper';

var scrapper = new LinkScraper("http://medium.com", 5);
scrapper.start();
