import {Router} from "express";
import {HttpCode} from "../../const.js";
import {asyncHandler, createFormError} from "../../utils.js";
import categoriesValidation from "../middlewares/categories-validation.js";
import routeParamsValidation from "../middlewares/route-params-validator.js";


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

  route.post(`/`, [categoriesValidation], asyncHandler(
      async (req, res) => {
        const {name} = req.body;
        const category = await service.create({name});
        if (category) {
          return res.status(HttpCode.CREATED).json(category);
        } else {
          return res.status(HttpCode.BAD_REQUEST)
            .send(createFormError(`name`, `Такая категория уже существует`));
        }
      }
  ));

  route.delete(`/`, asyncHandler(
      async (req, res) => {
        const {id} = req.body;
        const result = await service.delete(id);

        if (result) {
          return res.status(HttpCode.OK).json({status: result});
        } else {
          return res.status(HttpCode.BAD_REQUEST)
          .send(createFormError(id, `Невозможно удалить, так как имеются статьи в данной категории`));
        }
      }
  ));

  route.put(`/:categoryId`,
      [routeParamsValidation, categoriesValidation],
      asyncHandler(
          async (req, res) => {
            const {categoryId} = req.params;
            const {name} = req.body;

            const result = await service.update(categoryId, name);

            if (result) {
              return res.status(HttpCode.OK).json({status: result});
            } else {
              return res.status(HttpCode.BAD_REQUEST)
                .send(createFormError(categoryId, `Такая категория уже существует`));
            }
          }
      ));
};
