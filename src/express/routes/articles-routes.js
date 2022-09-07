import {Router} from 'express';
import {getDefaultAPI} from '../api.js';

const api = getDefaultAPI();


const router = new Router();

router.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`articles`, {articles});
});
router.get(`/add`, (req, res) => res.render(`add-post`));
router.get(`/edit/:id`, (req, res) => res.render(`articles-by-category`));
router.get(`/category/:id`, (req, res) => res.render(`articles`));
router.get(`/:id`, (req, res) => res.render(`article`));

export default router;
