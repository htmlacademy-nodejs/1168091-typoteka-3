import express from "express";
import request from "supertest";
import {ArticlesService} from "../data-service/articles.js";
import articles from "./articles";
import {HttpCode} from "../const.js";

import {testMockData} from "../const.js";

const FIRST_ARTICLE_ID = `YM07yi`;
const DEFUNCT_ARTICLE_ID = `yTdbMi`;

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(testMockData));
  app.use(express.json());
  articles(app, new ArticlesService(cloneData));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "FIRST_ARTICLE_ID"`, () => expect(response.body[0].id).toBe(`${FIRST_ARTICLE_ID}`));
});

describe(`API returns list of comments if article id = FIRST_ARTICLE_ID`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${FIRST_ARTICLE_ID}/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
});

describe(`API returns error if request comments and article didn't found`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${DEFUNCT_ARTICLE_ID}/comments`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API returns an article with given id = FIRST_ARTICLE_ID`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${FIRST_ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));
});

describe(`API returns error if article didn't found`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${DEFUNCT_ARTICLE_ID}`);
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

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
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
    category: `New category`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${FIRST_ARTICLE_ID}`)
      .send(changedArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer is really changed`, () => request(app)
    .get(`/articles/${FIRST_ARTICLE_ID}`)
    .expect((res) => expect(res.body.title).toBe(`New title`))
  );
});

describe(`API add's new comment`, () => {
  const newComment = {
    text: `New comment`
  };
  const app = createAPI();

  let response;

  let commentsCount;

  beforeAll(async () => {
    response = await request(app).get(`/articles/${FIRST_ARTICLE_ID}/comments`);
    commentsCount = response.body.length;
  });


  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/${FIRST_ARTICLE_ID}/comments`)
      .send(newComment);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(commentsCount + 1));

});

test(`API doesn't change defunct article`, () => {
  const app = createAPI();

  const changedArticle = {
    title: `New title`,
    announce: `New announce`,
    fullText: `New full text`,
    category: `New category`
  };

  return request(app)
    .put(`/articles/${DEFUNCT_ARTICLE_ID}`)
    .send(changedArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API doesn't change article if data is invalid`, () => {
  const app = createAPI();

  const changedArticle = {
    title: `New title`
  };

  return request(app)
    .put(`/articles/${FIRST_ARTICLE_ID}`)
    .send(changedArticle)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/${DEFUNCT_ARTICLE_ID}`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Котики сибирский`,
    announce: `Дам погладить котика`,
    fullText: `Дам погладить котика. Совершенно бесплатно.`,
    category: `Домашние животные`
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  let lengthArticles;

  beforeAll(async () => {
    const {res} = await request(app).get(`/articles`);
    lengthArticles = JSON.parse(res.text).length;
  });

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${FIRST_ARTICLE_ID}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(FIRST_ARTICLE_ID));

  test(`Articles count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => {
      return expect(res.body.length).toBe(lengthArticles - 1);
    })
  );
});
