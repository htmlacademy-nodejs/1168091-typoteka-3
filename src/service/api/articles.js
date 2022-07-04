import {Router} from "express";
import {HttpCode} from "../const";

const route = new Router();

export default (app, service) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await service.findAll();
    res.status(HttpCode.OK)
      .json(articles);
  });
};
