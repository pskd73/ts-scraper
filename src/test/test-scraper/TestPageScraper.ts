import * as JQuery from "jquery";
import * as ParseUrl from "parse-url";
import PageScraper from "../../PageScraper";

class TestPageScraper extends PageScraper {

    public jQueryObject: JQuery = null;

    public parse($) {
        this.jQueryObject = $;
        return {};
    }
}

export default TestPageScraper;
