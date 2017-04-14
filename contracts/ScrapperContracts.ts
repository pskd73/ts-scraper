interface ScrapperContracts {
    onScrapResponse(links: Array<string>, parentLink: string)
    start()
}

export default ScrapperContracts;
