# ts-scraper
Web scraper written on TypeScript ![alt tag](https://travis-ci.org/pskd73/ts-scraper.svg?branch=master)

It is a webscraper which can be extendable to do multiple tasks on scraped content. It propogates through the links it finds in the page. It makes use of `ts-jobrunner` library to run everything in terms of jobs.

## Installation
`npm install --save ts-scraper`

## Core API
```
CoreScraper(abstract)
    - protected init(): void
    - protected canFetchUrl(url): boolean
    - protected createJob(link): CoreJob
    - protected onFetchComplete(link, response): void
    - public start(): void
PageScraper(abstract)
    - public async start()
    - public abstract parse(jquery: JQuery): any;
ScrapeJob(abstract)
    - public run()
    - abstract createPageScraper(url: string): PageScraper
```

- There are three components in this library `CoreScraper`, `PageScraper` and `ScrapeJob`.
- `ScrapeJob` extends CoreJob from `ts-jobrunner` library. Its object exposes function `createPageScraper(url)` which creates `PageScraper` which actally mines/scrapes the page.
- `PageScraper` exposes a function `parse($)` which takes jQuery object. You can mine the page as your wish and return the parsed response
- `CoreScraper` is the main object which runs the scraping process. Its object has to have above mentioned functions.
    - `init()` all initiations can be put here
    - `canFetchUrl(url)` should tell whether to fetch the found link `url`
    - `createJob(link)` should return a `CoreJob` type job, which then be queued
    - `onFetchComplete(link, response)` will get triggered when a `ScrapeJob` job is completed ie., when a `PageScraper` is done. You can have code which handles the response returned by `PageScraper` here
    - `start()` will actually the scraping process (`start()` on `JobRunner`)

## Example
Please find example usage in `src/test/test-scraper` folder

Suggestions and contributions are open. Happy coding :)
