import CoreJob from 'app/jobrunner/CoreJob';
import * as ImageDownloader from 'image-downloader';
import * as Base64Img from 'base64-img';

class ImageDownloaderJob extends CoreJob {

    public url: string

    constructor(url){
        super();
        this.url = url;
    }

    async run(){
        try {
            if(this.url){
                const dest = __dirname + '/../../downloads/';
                const filename = (new Date()).getTime();
                if(this.url.indexOf('data:') == 0){
                    Base64Img.img(this.url, dest, filename, () => {});
                }else{
                    const ext = /(?:\.([^.]+))?$/.exec(this.url)[1];
                    const response = await ImageDownloader.image({
                        url: this.url,
                        dest: dest + filename + '.' + ext
                    });
                }

                return {
                    status: true,
                    response: {}
                };
            }
        }catch(e){
            console.log("Image download error", e);
        }
        return null;
    }
}

export default ImageDownloaderJob;
