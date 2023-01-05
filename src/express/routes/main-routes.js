import {Router} from 'express';
import {getDefaultAPI} from '../api.js';

const router = new Router();
const api = getDefaultAPI();


router.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories({withCount: true})
  ]);
  res.render(`main`, {articles, categories});
});

router.get(`/register`, (req, res) => res.render(`registration`));

router.get(`/login`, (req, res) => res.render(`login`));

router.get(`/search`, async (req, res) => {
  const {search} = req.query;
  try {
    const result = await api.search(search);
    res.render(`search`, {result, search});
  } catch (e) {
    res.render(`search`, {result: [], search});
  }
});
router.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories({withCount: false});
  res.render(`categories`, {categories});
});

export default router;
