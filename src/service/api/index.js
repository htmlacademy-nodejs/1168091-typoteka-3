import {Router} from "express";
import {
  ArticlesService,
  CategoryService,
  SearchService
} from "../data-service/index.js";

import category from "./categories.js";
import articles from "./articles.js";
import search from "./search.js";

import {getMockData} from "../lib/get-mock-data.js";

const app = new Router();

(async () => {
  const data = await getMockData();
  articles(app, new ArticlesService(data));
  category(app, new CategoryService(data));
  search(app, new SearchService(data));
})();

export default app;
