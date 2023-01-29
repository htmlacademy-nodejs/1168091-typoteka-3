import {Sequelize} from "sequelize";
import express from "express";
import request from "supertest";
import search from "./search.js";
import {SearchService} from "../data-service";
import {testMockData, mockCategories, mockUsers, HttpCode} from "../../const.js";
import initDb from "../lib/init-db.js";

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDB, {categories: mockCategories, users: mockUsers, articles: testMockData});
  search(app, new SearchService(mockDB));
});


describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `золотое сечение`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct title`, () => expect(response.body[0].title).toBe(`Что такое золотое сечение`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
    .get(`/search`)
    .query({
      query: `Продам свою душу`
    })
    .expect(HttpCode.NOT_FOUND)
);

test(`API returns code 400 if query string is absent`,
    () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
);

