import ScrapeResponse from 'app/scraper/contracts/ScrapResponse';
import PageScraperContract from 'app/scraper/contracts/PageScraperContract';
import * as Request from 'request';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import * as Lodash from 'lodash';
import * as ParseUrl from 'parse-url';

abstract class PageScraper implements PageScraperContract {

    public url
    public response
    public body
    public links: Array<string> = []

    constructor(url){
        this.url = url;
    }

    protected promiseRequest(): Promise<any> {
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

    protected promiseJsdom(body: string): Promise<Object> {
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

    public async getJquery(): Promise<JQuery> {
        let $ = null;
        if(this.body){
            const window = await this.promiseJsdom(this.body);
            $ = jquery(window);
        }
        return $;
    }

    public parseLinks($): Array<string> {
        const anchors = $('a');
        const links = []
        for(var i=0;i<anchors.length;i++){
            let href = anchors[i].href;
            if(href[0] == '/'){
                const parsedUrl = ParseUrl(this.url);
                href = parsedUrl.protocol + '://' + parsedUrl.resource + href;
            }
            links.push(href);
        }
        return links
    }

    public async start(){
        const {response, body} = await this.promiseRequest();
        this.response = response;
        this.body = body;
        const jQuery = await this.getJquery();
        this.links = this.parseLinks(jQuery);
        const parsedData = await this.parse(jQuery);
        return {
            links: this.links,
            body: this.body,
            response: this.response,
            url: this.url,
            parsedData
        };
    }

    public abstract parse(jquery: JQuery): any

}

export default PageScraper;
