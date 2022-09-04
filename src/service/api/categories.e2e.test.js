import express from "express";
import request from "supertest";
import categories from './categories';
import {CategoryService} from "../data-service";
import {HttpCode} from "../const.js";
import {testMockData} from "../const.js";

const app = express();
app.use(express.json());

categories(app, new CategoryService(testMockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(4));
  test(`Category names are "За жизнь", "Кино", "Без рамки", "Разное"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`За жизнь`, `Кино`, `Без рамки`, `Разное`])
      )
  );
});
