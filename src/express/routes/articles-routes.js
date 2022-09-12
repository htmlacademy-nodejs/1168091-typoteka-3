import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import moment from 'moment';

const api = getDefaultAPI();


const router = new Router();

router.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories()
  ]);
  res.render(`articles`, {articles, categories});
});
router.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  const date = moment(Date.now()).format(`YYYY-MM-DD`);
  res.render(`add-post`, {categories, date});
});
router.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getOneArticle(id),
      api.getCategories()
    ]);
    res.render(`article`, {article, categories});
  } catch ({response: {status}}) {
    if (status === 404 || status === 500) {
      res.render(`errors/${status}`);
    }
  }
});
router.get(`/category/:id`, (req, res) => res.render(`articles`));
router.get(`/:id`, (req, res) => res.render(`article`));

export default router;
