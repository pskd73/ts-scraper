import ScrapeResponse from 'app/contracts/ScrapResponse';
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

    private promiseRequest(): Promise<any> {
        return new Promise((resolve, reject) => {
            Request(this.url, (err, response, body) => {
                if(err){
                    reject(err);
                }else{
                    resolve({response, body});
                }
            });
        });
    }

    private promiseJsdom(body: string): Promise<Object> {
        return new Promise(function(resolve, reject){
            jsdom.env(body, (err, window) => {
                if(err){
                    reject(err);
                }else{
                    resolve(window);
                }
            });
        });
    }

    async get(): Promise<ScrapeResponse>{
        const response = await this.promiseRequest();
        const links = [];
        if(response.body){
            const window = await this.promiseJsdom(response.body);
            const $ = jquery(window);
            const anchors = $('a');
            for(var i=0;i<anchors.length;i++){
                let href = anchors[i].href;
                if(href[0] == '/'){
                    const parsedUrl = ParseUrl(this.url);
                    href = parsedUrl.protocol + '://' + parsedUrl.resource + href;
                }
                links.push(href);
            }
        }
        return {
            links,
            body: response.body,
            response: response.response
        };
    }
}

export default ScrapPage;
