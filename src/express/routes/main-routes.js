import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import {asyncHandler, getPageSettings} from '../utils.js';
import {ARTICLES_PER_PAGE, DATE_FORMAT} from '../const.js';
import moment from 'moment';

const router = new Router();
const api = getDefaultAPI();


router.get(`/`, asyncHandler(
    async (req, res) => {
      const {page, limit, offset} = getPageSettings(req);
      const [{articles, count}, categories] = await Promise.all([
        api.getArticles({comments: true, limit, offset}),
        api.getCategories({withCount: true})
      ]);

      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

      articles.forEach((article) => {
        article.date = moment(article.createdAt).format(DATE_FORMAT);
      });

      res.render(`main`, {articles, categories, totalPages, page});
    }
));

router.get(`/register`, (req, res) => res.render(`registration`));

router.get(`/login`, (req, res) => res.render(`login`));

router.get(`/search`, asyncHandler(
    async (req, res) => {
      const {search} = req.query;
      try {
        const result = await api.search(search);
        res.render(`search`, {result, search});
      } catch (e) {
        res.render(`search`, {result: [], search});
      }
    }
));
router.get(`/categories`, asyncHandler(
    async (req, res) => {
      const categories = await api.getCategories({withCount: false});
      res.render(`categories`, {categories});
    }
));

export default router;
