"use strict";

const {Router} = require(`express`);

const {getMockData} = require(`../lib/get-mock-data`);

const {
  CommentsService,
  OffersService,
  SearchService,
  CategoriesService,
} = require(`../data-service`);

const categories = require(`./categories`);
const offers = require(`./offers`);
const search = require(`./search`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categories(app, new CategoriesService(mockData));
  offers(app, new OffersService(mockData), new CommentsService());
  search(app, new SearchService(mockData));

})();

module.exports = app;
