import {Router} from "express";
import {HttpCode} from "../const.js";
import requiredFieldsValidation from "../middlewares/required-fields-validation.js";
import articleExist from "../middlewares/article-exist.js";

const REQUIRED_ARTICLE_FIELDS = [`title`, `announce`, `fullText`, `categories`, `createdDate`, `photo`];
const REQUIRED_COMMENT_FIELDS = [`text`];

const route = new Router();

export default (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;

    const articles = await articleService.findAll(comments);
    res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article: {id}} = res.locals;

    const comments = await commentService.findAll(id);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.post(`/`, requiredFieldsValidation(REQUIRED_ARTICLE_FIELDS), async (req, res) => {

    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.post(
      `/:articleId/comments`,
      [articleExist(articleService), requiredFieldsValidation(REQUIRED_COMMENT_FIELDS)],
      async (req, res) => {
        const {article: {id}} = res.locals;
        const {text} = req.body;
        const comment = await commentService.create(id, text);

        return res.status(HttpCode.OK)
      .json(comment);
      });

  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article: {id}} = res.locals;

    articleService.delete(id);

    return res.status(HttpCode.OK).json({id}).send(`Article ${id} was deleted`);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {commentId} = req.params;
    const comments = await commentService.delete(commentId);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.put(`/:articleId`,
      [articleExist(articleService), requiredFieldsValidation(REQUIRED_ARTICLE_FIELDS)],
      async (req, res) => {
        const {article: {id}} = res.locals;
        const newArticle = req.body;

        const changedArticle = await articleService.update(id, newArticle);

        return res.status(HttpCode.OK).json(changedArticle);
      }
  );
};
