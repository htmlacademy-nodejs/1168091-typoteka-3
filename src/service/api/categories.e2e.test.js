import {Sequelize} from "sequelize";
import express from "express";
import request from "supertest";
import categories from './categories';
import {CategoryService} from "../data-service";
import {testMockData, mockCategories, mockUsers, HttpCode} from "../../const.js";
import initDb from "../lib/init-db.js";

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDB, {categories: mockCategories, users: mockUsers, articles: testMockData});
  categories(app, new CategoryService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 9 categories`, () => expect(response.body.length).toBe(9));
  test(`Category names are "За жизнь", "Кино", "Без рамки", "Разное"`,
      () => expect(response.body.map((it) => it.name)).toEqual(
          expect.arrayContaining(mockCategories)
      )
  );
});

describe(`API create category`, () => {
  const newCategory = {
    name: `New category`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/categories`).send(newCategory);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API doesn't create category with name`, () => {
  const newCategory = {
    name: `New category`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/categories`).send(newCategory);

    response = await request(app)
      .post(`/categories`).send(newCategory);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
});
