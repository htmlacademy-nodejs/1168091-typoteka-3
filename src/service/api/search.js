import {Router} from "express";
import {HttpCode} from "../const.js";
import {asyncHandler} from "../utils.js";

export default (app, searchService) => {
  const route = new Router();
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
