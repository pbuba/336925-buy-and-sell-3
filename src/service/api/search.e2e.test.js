"use strict";

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = [{
  "id": `tUQzGR`,
  "category": [`Подписка`],
  "description": `Даю недельную гарантию. Пользовались бережно и только по большим праздникам. Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города.`,
  "picture": `item01.jpg`,
  "title": `Куплю породистого кота`,
  "type": `offer`,
  "sum": 25493,
  "comments": [{"id": `ipfFhY`, "text": `Вы что?! В магазине дешевле. А где блок питания? Неплохо, но дорого Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`}]
}];

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`Api returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Куплю породистого кота`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`tUQzGR`));
});

test(`Api return 404 if nothing is found`, () => {
  return request(app)
    .get(`/search`)
    .query({
      query: `Другой заголовок`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`Api return 400 when query string is absent`, () => {
  return request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST);
});
