import * as JQuery from "jquery";
import ScrapResponse from "./ScrapResponse";

interface IPageScraperContract {
    url: string;
    response: object;
    body: string;
    start(): Promise<ScrapResponse>;
}

export default IPageScraperContract;
