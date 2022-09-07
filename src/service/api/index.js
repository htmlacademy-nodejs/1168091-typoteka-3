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

const router = new Router();

(async () => {
  const data = await getMockData();
  articles(router, new ArticlesService(data));
  category(router, new CategoryService(data));
  search(router, new SearchService(data));
})();

export default router;
