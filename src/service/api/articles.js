import {Router} from "express";
import {HttpCode} from "../const.js";
import requiredFieldsValidation from "../middlewares/required-fields-validation.js";
import articleExist from "../middlewares/article-exist.js";

const REQUIRED_ARTICLE_FIELDS = [`title`, `announce`, `fullText`, `category`];
const REQUIRED_COMMENT_FIELDS = [`text`];

const route = new Router();

export default (app, articleService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();
    res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article: {id}} = res.locals;

    const comments = articleService.findComments(id);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/`, requiredFieldsValidation(REQUIRED_ARTICLE_FIELDS), (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(
      `/:articleId/comments`,
      [articleExist(articleService), requiredFieldsValidation(REQUIRED_COMMENT_FIELDS)],
      (req, res) => {
        const {article} = res.locals;
        const {text} = req.body;
        const comment = articleService.createComment(article, text);

        return res.status(HttpCode.OK)
      .json(comment);
      });

  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article: {id}} = res.locals;

    articleService.delete(id);

    return res.status(HttpCode.OK).send(`Article ${id} was deleted`);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {articleId, commentId} = req.params;
    const comments = articleService.deleteComment(articleId, commentId);

    return res.status(HttpCode.OK)
      .json(comments);
  });
};
