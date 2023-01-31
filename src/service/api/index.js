import {Router} from "express";
import {
  ArticlesService,
  CategoryService,
  SearchService,
  CommentService,
  UserService
} from "../data-service/index.js";

import {sequelize} from "../lib/sequelize.js";
import defineModels from "../models/index.js";

import category from "./categories.js";
import articles from "./articles.js";
import search from "./search.js";
import user from "./user.js";

export const createRoutes = async () => {
  const router = new Router();
  defineModels(sequelize);

  articles(router, new ArticlesService(sequelize), new CommentService(sequelize));
  category(router, new CategoryService(sequelize));
  search(router, new SearchService(sequelize));
  user(router, new UserService(sequelize));

  return router;
};
