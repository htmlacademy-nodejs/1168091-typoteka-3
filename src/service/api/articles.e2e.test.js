import {Sequelize} from "sequelize";
import express from "express";
import request from "supertest";
import {ArticlesService} from "../data-service/articles.js";
import {CommentService} from "../data-service/comments.js";
import articles from "./articles";
import {HttpCode} from "../const.js";

import {testMockData, mockCategories, mockUsers} from "../const.js";
import initDb from "../lib/init-db.js";

const FIRST_ARTICLE_ID = 1;
const DEFUNCT_ARTICLE_ID = 22;

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDB, {categories: mockCategories, users: mockUsers, articles: testMockData});

  const app = express();
  app.use(express.json());

  articles(app, new ArticlesService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const api = await createAPI();
    response = await request(api).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 3 offers`, () => expect(response.body.length).toBe(3));
});

describe(`API returns list of comments if article id = FIRST_ARTICLE_ID`, () => {
  let response;

  beforeAll(async () => {
    const api = await createAPI();
    response = await request(api).get(`/articles/${FIRST_ARTICLE_ID}/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 3 offers`, () => expect(response.body.length).toBe(3));
});

describe(`API returns error if request comments and article didn't found`, () => {
  let response;

  beforeAll(async () => {
    const api = await createAPI();
    response = await request(api).get(`/articles/${DEFUNCT_ARTICLE_ID}/comments`);
  });

  test(`Returns error`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API returns an article with given id = FIRST_ARTICLE_ID`, () => {
  let response;

  beforeAll(async () => {
    const api = await createAPI();
    response = await request(api).get(`/articles/${FIRST_ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
});

describe(`API returns error if article didn't found`, () => {
  let response;

  beforeAll(async () => {
    const api = await createAPI();
    response = await request(api).get(`/articles/${DEFUNCT_ARTICLE_ID}`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Котик сибирский`,
    announce: `Дам погладить котика`,
    fullText: `Дам погладить котика. Совершенно бесплатно.`,
    category: `Домашние животные`
  };

  let api;

  beforeAll(async () => {
    api = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(api)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const changedArticle = {
    title: `New title`,
    announce: `New announce`,
    fullText: `New full text`,
    categories: [`1`],
    picture: `lamp.jpg`
  };

  let api;
  let response;

  beforeAll(async () => {
    api = await createAPI();
    response = await request(api)
      .put(`/articles/${FIRST_ARTICLE_ID}`)
      .send(changedArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer is really changed`, () => request(api)
    .get(`/articles/${FIRST_ARTICLE_ID}`)
    .expect((res) => expect(res.body.title).toBe(`New title`))
  );
});

describe(`API add's new comment`, () => {
  const newComment = {
    fullText: `New comment`
  };

  let response;
  let api;
  let commentsCount;


  beforeAll(async () => {
    api = await createAPI();
    response = await request(api).get(`/articles/${FIRST_ARTICLE_ID}/comments`);
    commentsCount = response.body.length;
    response = await request(api)
      .post(`/articles/${FIRST_ARTICLE_ID}/comments`)
      .send(newComment);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  beforeAll(async () => {
    response = await request(api).get(`/articles/${FIRST_ARTICLE_ID}/comments`);
  });

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(commentsCount + 1));
});

test(`API doesn't change defunct article`, async () => {
  const api = await createAPI();

  const changedArticle = {
    title: `New title`,
    announce: `New announce`,
    fullText: `New full text`,
    categories: [`1`],
    picture: `lamp.jpg`
  };

  return await request(api)
    .put(`/articles/${DEFUNCT_ARTICLE_ID}`).send(changedArticle).expect(HttpCode.NOT_FOUND);
});

test(`API doesn't change article if data is invalid`, async () => {
  const api = await createAPI();

  const changedArticle = {
    title: `New title`
  };

  return await request(api)
    .put(`/articles/${FIRST_ARTICLE_ID}`)
    .send(changedArticle)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to delete non-existent article`, async () => {
  const api = await createAPI();

  return request(api)
    .delete(`/articles/${DEFUNCT_ARTICLE_ID}`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `New title`,
    announce: `New announce`,
    fullText: `New full text`,
    categories: [`1`],
    picture: `lamp.jpg`
  };

  let api;
  let response;

  beforeAll(async () => {
    api = await createAPI();
    response = await request(api)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Articles count is changed`, () => request(api)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

describe(`API correctly deletes an article`, () => {
  let api;
  let response;
  let lengthArticles;

  beforeAll(async () => {
    api = await createAPI();
    const {res} = await request(api).get(`/articles`);
    lengthArticles = JSON.parse(res.text).length;
    response = await request(api)
      .delete(`/articles/${FIRST_ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(FIRST_ARTICLE_ID));

  test(`Articles count is 4 now`, () => request(api)
    .get(`/articles`)
    .expect((res) => {
      return expect(res.body.length).toBe(lengthArticles - 1);
    })
  );
});
