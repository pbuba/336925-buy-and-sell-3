"use strict";

const express = require(`express`);
const request = require(`supertest`);

const offers = require(`./offers`);
const {OffersService, CommentsService} = require(`../data-service`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `tUQzGR`,
    "category": [`Подписка`],
    "description": `Даю недельную гарантию. Пользовались бережно и только по большим праздникам. Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item01.jpg`,
    "title": `Куплю породистого кота`,
    "type": `offer`,
    "sum": 25493,
    "comments": [{"id": `ipfFhY`, "text": `Вы что?! В магазине дешевле.`}]
  },
  {
    "id": `tUQzGB`,
    "category": [`Подписка`],
    "description": `Даю недельную гарантию. Пользовались бережно и только по большим праздникам. Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item01.jpg`,
    "title": `кот`,
    "type": `offer`,
    "sum": 25493,
    "comments": [{"id": `ipfFhY`, "text": `Вы что?! В магазине дешевле.`}]
  },
  {
    "id": `tUQzGT`,
    "category": [`Подписка`],
    "description": `Даю недельную гарантию. Пользовались бережно и только по большим праздникам. Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item01.jpg`,
    "title": `Куплю`,
    "type": `offer`,
    "sum": 25493,
    "comments": [{"id": `ipfFhY`, "text": `Вы что?! В магазине дешевле.`}]
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());

  offers(app, new OffersService(cloneData), new CommentsService());

  return app;
};

describe(`API return a list of all offers`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns 3 offers`, () => expect(response.body.length).toBe(3));
  test(`First offer's id equals tUQzGR`, () => expect(response.body[0].id).toBe(`tUQzGR`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code is 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];

      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/tUQzGB`)
      .send(newOffer);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Returns changed offer`, () => {
    return expect(response.body).toEqual(expect.objectContaining(newOffer));
  });
  test(`Offer is really changed`, () => {
    return request(app)
      .get(`/offers/tUQzGB`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`));
  });
});

describe(`API delete offer`, () => {

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/tUQzGT`);
  });

  test(`Status code is 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`Delete right id`, () => {
    return expect(response.body.id).toBe(`tUQzGT`);
  });

  // TODO this test not work
  test(`Offers count is 2`, () => {
    return request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(2));
  });

});


