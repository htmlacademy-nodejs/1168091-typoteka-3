import {Router} from "express";
import {HttpCode} from "../const.js";

const route = new Router();

export default (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query} = req.query;
    const result = service.findAll(query);

    return res.status(HttpCode.OK)
      .json(result);
  });
};
