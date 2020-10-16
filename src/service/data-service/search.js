"use strict";

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(searchValue) {
    return this._offers.filter((offer) => offer.title.includes(searchValue));
  }
}

module.exports = SearchService;
