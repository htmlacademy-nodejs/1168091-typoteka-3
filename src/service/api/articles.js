import {Router} from "express";
import {HttpCode} from "../../const.js";
import articleExist from "../middlewares/article-exist.js";
import articleValidation from "../middlewares/article-validation.js";
import commentValidation from "../middlewares/comment-validation.js";
import routeParamsValidation from "../middlewares/route-params-validator.js";
import {asyncHandler} from "../../utils.js";

export default (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, asyncHandler(
      async (req, res) => {
        const {offset, limit, comments, categoryId} = req.query;

        let result;

        if (limit || offset) {
          result = await articleService.findPage({offset, limit, categoryId});
        } else {
          result = await articleService.findAll(comments);
        }
        res.status(HttpCode.OK)
        .json(result);
      }
  ));

  route.get(`/:articleId`,
      routeParamsValidation,
      asyncHandler(
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

  route.get(`/:articleId/comments`,
      [routeParamsValidation, articleExist(articleService)],
      asyncHandler(
          async (req, res) => {
            const {articleId} = req.params;
            const comments = await commentService.findAll(articleId);

            return res.status(HttpCode.OK)
        .json(comments);
          }
      ));

  route.post(`/`,
      articleValidation,
      asyncHandler(
          async (req, res) => {
            const newArticle = req.body;

            const article = await articleService.create(newArticle);

            return res.status(HttpCode.CREATED)
        .json(article);
          }
      ));

  route.post(
      `/:articleId/comments`,
      [routeParamsValidation, articleExist(articleService), commentValidation],
      asyncHandler(
          async (req, res) => {
            const {fullText, userId} = req.body;
            const articleId = res.locals.article.id;
            const comment = await commentService.create(articleId, {fullText, userId});

            return res.status(HttpCode.OK).json(comment);
          }
      ));

  route.delete(`/:articleId`,
      [routeParamsValidation, articleExist(articleService)],
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
      [routeParamsValidation, articleExist(articleService)],
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
      [routeParamsValidation, articleExist(articleService), articleValidation],
      asyncHandler(
          async (req, res) => {
            const {articleId} = req.params;
            const newArticle = req.body;
            const result = await articleService.update(articleId, newArticle);

            return res.status(HttpCode.OK).json({status: result});
          }
      )
  );
};
