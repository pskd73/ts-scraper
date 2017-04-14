import JobRunner from 'app/core/JobRunner';
import Job from 'app/Job';
import ScrapPage from 'app/core/ScrapPage';
import Scrapper from 'app/Scrapper';
import * as Request from 'request';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';

const scrapper = new Scrapper("https://finomena.com", 100);
scrapper.start();
