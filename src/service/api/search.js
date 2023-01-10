import {Router} from "express";
import {HttpCode} from "../const.js";
import {asyncHandler} from "../utils.js";

const route = new Router();

export default (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, asyncHandler(
      async (req, res) => {
        const {query} = req.query;

        if (!query) {
          return res.status(HttpCode.BAD_REQUEST)
        .send(`Bad request`);
        }

        const result = await searchService.findAll(query);
        const statusCode = result.length ? HttpCode.OK : HttpCode.NOT_FOUND;

        return res.status(statusCode)
        .json(result);
      }
  ));
};
