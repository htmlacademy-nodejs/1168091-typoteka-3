import {Router} from "express";
import {HttpCode} from "../../const.js";
import {asyncHandler} from "../../utils.js";
import userValidator from "../middlewares/user-validation.js";
import passwordUtils from "../lib/password.js";
import {UserRole} from "../../const.js";

export default (app, service) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), asyncHandler(
      async (req, res) => {
        const data = req.body;

        data.passwordHash = await passwordUtils.hash(data.password);

        const value = await service.getUserCount();

        data.role = value ? UserRole.READER : UserRole.AUTHOR;

        const result = await service.create(data);

        delete result.passwordHash;

        res.status(HttpCode.CREATED)
        .json(result);
      }
  ));
};
