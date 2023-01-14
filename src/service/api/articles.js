import {Router} from "express";
import {HttpCode} from "../const.js";
import requiredFieldsValidation from "../middlewares/required-fields-validation.js";
import articleExist from "../middlewares/article-exist.js";
import {asyncHandler} from "../utils.js";

const REQUIRED_ARTICLE_FIELDS = [`title`, `announce`, `fullText`, `categories`, `picture`, `createdDate`];
const REQUIRED_COMMENT_FIELDS = [`fullText`];


export default (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, asyncHandler(
      async (req, res) => {
        const {offset, limit, comments} = req.query;

        let result;

        if (limit || offset) {
          result = await articleService.findPage({offset, limit});
        } else {
          result = await articleService.findAll(comments);
        }
        res.status(HttpCode.OK)
        .json(result);
      }
  ));

  route.get(`/:articleId`, asyncHandler(
      async (req, res) => {
        const {articleId} = req.params;
        const article = await articleService.findOne(articleId);

        if (!article) {
          return res.status(HttpCode.NOT_FOUND)
          .send(`Not found article with ${articleId}`);
        }

        return res.status(HttpCode.OK)
        .json(article);
      }
  ));

  route.get(`/:articleId/comments`, articleExist(articleService), asyncHandler(
      async (req, res) => {
        const {articleId} = req.params;
        const comments = await commentService.findAll(articleId);

        return res.status(HttpCode.OK)
        .json(comments);
      }
  ));

  route.post(`/`, requiredFieldsValidation(REQUIRED_ARTICLE_FIELDS), asyncHandler(
      async (req, res) => {
        const newArticle = req.body;

        newArticle.userId = 1; // TODO: Бэк вставляет userId

        const article = await articleService.create(newArticle);

        return res.status(HttpCode.CREATED)
        .json(article);
      }
  ));

  route.post(
      `/:articleId/comments`,
      [articleExist(articleService), requiredFieldsValidation(REQUIRED_COMMENT_FIELDS)],
      asyncHandler(
          async (req, res) => {
            const {articleId} = req.params;
            const {fullText} = req.body;
            const comment = await commentService.create(articleId, {fullText, userId: 1});

            return res.status(HttpCode.OK)
        .json(comment);
          }
      ));

  route.delete(`/:articleId`,
      articleExist(articleService),
      asyncHandler(
          async (req, res) => {
            const {articleId} = req.params;

            const result = await articleService.delete(articleId);

            if (result) {
              return res.status(HttpCode.OK).json({status: result}).send(`Article ${articleId} was deleted`);
            } else {
              return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({status: result});
            }
          }
      ));

  route.delete(`/:articleId/comments/:commentId`,
      articleExist(articleService),
      asyncHandler(
          async (req, res) => {
            const {commentId} = req.params;
            const result = await commentService.delete(commentId);

            if (result) {
              return res.status(HttpCode.OK).json({status: result});
            } else {
              return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({status: result});
            }
          }
      ));

  route.put(`/:articleId`,
      [articleExist(articleService), requiredFieldsValidation(REQUIRED_ARTICLE_FIELDS)],
      asyncHandler(
          async (req, res) => {
            const {articleId} = req.params;
            const newArticle = req.body;
            const changedArticle = await articleService.update(articleId, newArticle);

            return res.status(HttpCode.OK).json(changedArticle);
          }
      )
  );
};
