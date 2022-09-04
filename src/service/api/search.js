import {Router} from "express";
import {HttpCode} from "../const.js";

const route = new Router();

export default (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query} = req.query;


    if (!query) {
      return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
    }

    const result = service.findAll(query);
    const statusCode = result.length ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res.status(statusCode)
      .json(result);
  });
};
