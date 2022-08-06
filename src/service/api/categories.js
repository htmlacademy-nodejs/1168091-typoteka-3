import {Router} from "express";
import {HttpCode} from "../const.js";

const route = new Router();

export default (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const categories = await service.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });
};
