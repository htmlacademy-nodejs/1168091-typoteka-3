import {Router} from 'express';
import {getDefaultAPI} from '../api.js';

const api = getDefaultAPI();


const router = new Router();

router.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories()
  ]);
  res.render(`articles`, {articles, categories});
});
router.get(`/add`, (req, res) => res.render(`add-post`));
router.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const article = await api.getOneArticle(id);
    console.log(`ARTICLE`, article);
    res.render(`article`, {article});
  } catch ({response: {status}}) {
    if (status === 404 || status === 500) {
      res.render(`errors/${status}`);
    }
  }
});
router.get(`/category/:id`, (req, res) => res.render(`articles`));
router.get(`/:id`, (req, res) => res.render(`article`));

export default router;
