import * as Request from 'request';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as Lodash from 'lodash';
import * as ParseUrl from 'parse-url';

class ScrapPage {

    private url: string

    constructor(url){
        this.url = url;
    }

    get(): Promise<Array<string>>{
        return new Promise((resolve, reject) => {
            Request(this.url, (err, response, body) => {
                if(body){
                    jsdom.env(body, (err, window) => {
                        const $ = jquery(window);
                        const anchors = $('a');
                        const links = [];
                        for(var i=0;i<anchors.length;i++){
                            let href = anchors[i].href;
                            if(href[0] == '/'){
                                const parsedUrl = ParseUrl(this.url);
                                href = parsedUrl.protocol + '://' + parsedUrl.resource + href;
                            }
                            links.push(href);
                        }
                        resolve(links);
                    });
                }else{
                    resolve([]);
                }
            });
        });
    }
}

export default ScrapPage;
