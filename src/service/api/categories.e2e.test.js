"use strict";

const express = require(`express`);
const request = require(`supertest`);

const categories = require(`./categories`);
const CategoriesService = require(`../data-service/categories`);
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
    "comments": [{"id": `ipfFhY`, "text": `Вы что?! В магазине дешевле. А где блок питания? Неплохо, но дорого Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`}]
  },
  {
    "id": `tUQzGw`,
    "category": [`Ещё одна категория`],
    "description": `Даю недельную гарантию. Пользовались бережно и только по большим праздникам. Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item01.jpg`,
    "title": `Куплю породистого кота`,
    "type": `offer`,
    "sum": 25493,
    "comments": [{"id": `ipfFhY`, "text": `Вы что?! В магазине дешевле. А где блок питания? Неплохо, но дорого Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`}]
  },
];

const app = express();
app.use(express.json());
categories(app, new CategoriesService(mockData));

describe(`Api returns category list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return 2 category`, () => expect(response.body.length).toBe(2));
  test(`Category names are "Подписка", "Ещё одна категория"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Ещё одна категория`, `Подписка`])
      )
  );
});
