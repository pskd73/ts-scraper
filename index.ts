import JobRunner from 'app/core/JobRunner';
import ScrapJob from 'app/ScrapJob';
import ScrapPage from 'app/core/ScrapPage';
import Scrapper from 'app/Scrapper';
import * as Request from 'request';
import * as jsdom from 'jsdom';
import * as jquery from 'jquery';

var scrapper = new Scrapper("http://finomena.com");
scrapper.start();
