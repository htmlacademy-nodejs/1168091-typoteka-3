import {Router} from "express";
import {HttpCode} from "../../const.js";
import {asyncHandler} from "../../utils.js";
import userValidator from "../middlewares/user-validation.js";
import {hash, compare} from "../lib/password.js";
import {UserRole} from "../../const.js";

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};


export default (app, service) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), asyncHandler(
      async (req, res) => {
        const data = req.body;

        data.passwordHash = await hash(data.password);

        const value = await service.getUserCount();

        data.role = value ? UserRole.READER : UserRole.AUTHOR;

        const result = await service.create(data);

        delete result.passwordHash;

        res.status(HttpCode.CREATED)
        .json(result);
      }
  ));

  route.post(`/auth`, asyncHandler(
      async (req, res) => {
        const {email, password} = req.body;
        const user = await service.findByEmail(email);

        if (!user) {
          res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
          return;
        }

        const passwordIsCorrect = await compare(password, user.passwordHash);

        if (passwordIsCorrect) {
          delete user.passwordHash;
          res.status(HttpCode.OK).json(user);
        } else {
          res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
        }
      }
  ));
};
