import {Sequelize} from "sequelize";
import express from "express";
import request from "supertest";
import user from "./user.js";
import {UserService} from "../data-service";
import {testMockData, mockCategories, mockUsers, HttpCode} from "../../const.js";
import initDb from "../lib/init-db.js";


const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDB, {categories: mockCategories, users: mockUsers, articles: testMockData});

  const app = express();
  app.use(express.json());

  user(app, new UserService(mockDB));
  return app;
};


describe(`API creates user if data is valid`, () => {
  const validUserData = {
    email: `ivanov1@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`,
  };

  let response;

  beforeAll(async () => {
    const api = await createAPI();
    response = await request(api)
      .post(`/user`)
      .send(validUserData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API refuses to create user if data is invalid`, () => {
  const validUserData = {
    email: `ivanov1@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });


  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, firstName: true},
      {...validUserData, email: 1}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

});
