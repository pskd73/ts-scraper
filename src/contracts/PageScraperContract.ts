import * as JQuery from 'jquery';
import ScrapResponse from './ScrapResponse';

interface PageScraperContract {
    url: string
    response: Object
    body: string
    start(): Promise<ScrapResponse>
}

export default PageScraperContract;
