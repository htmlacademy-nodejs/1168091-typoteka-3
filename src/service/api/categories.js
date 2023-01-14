import {Router} from "express";
import {HttpCode} from "../const.js";
import {asyncHandler} from "../utils.js";


export default (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, asyncHandler(
      async (req, res) => {
        const {withCount, offset, limit} = req.query;

        let result;

        if (limit || offset) {
          result = await service.findPage({offset, limit});
        } else {
          result = await service.findAll(withCount);
        }

        res.status(HttpCode.OK)
        .json(result);
      }
  ));
};
