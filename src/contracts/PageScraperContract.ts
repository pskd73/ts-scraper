import * as JQuery from "jquery";
import ScrapResponse from "./ScrapeResponse";

interface IPageScraperContract {
    url: string;
    response: object;
    body: string;
    start(): Promise<ScrapResponse>;
}

export default IPageScraperContract;
