import PageScraper from 'app/scraper/PageScraper';
import * as ParseUrl from 'parse-url';

class ImagePageScraper extends PageScraper {

    protected imageUrls: Array<string> = []

    parse($){
        const images = $('img');
        for(var i=0;i<images.length;i++){
            let imageUrl = $(images[i]).attr('src');
            if(imageUrl && imageUrl.indexOf('data:') != 0 && imageUrl[0] == '/'){
                const parsedUrl = ParseUrl(this.url);
                imageUrl = parsedUrl.protocol + '://' + parsedUrl.resource + imageUrl;
            }
            if(imageUrl && imageUrl.indexOf('data:') != 0 && imageUrl.indexOf('http://') == -1 && imageUrl.indexOf('https://') == -1){
                const parsedUrl = ParseUrl(this.url);
                imageUrl = parsedUrl.protocol + '://' + parsedUrl.resource + '/' + imageUrl;
            }
            if(this.imageUrls.indexOf(imageUrl) == -1){
                this.imageUrls.push(imageUrl);
            }
        }
        return this.imageUrls;
    }
}

export default ImagePageScraper;
