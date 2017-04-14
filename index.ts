import JobRunner from 'app/core/JobRunner';
import Job from 'app/Job';
import * as Request from 'request';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';
import ScrapPage from 'app/core/ScrapPage';
import Scrapper from 'app/core/Scrapper';

const scrapper = new Scrapper("https://finomena.com");
scrapper.start();
