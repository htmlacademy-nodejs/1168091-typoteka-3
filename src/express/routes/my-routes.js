import {Router} from 'express';
import {getDefaultAPI} from '../api.js';

const api = getDefaultAPI();

const router = new Router();

router.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {isLogin: true, articles});
});
router.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});

  let comments = [];
  articles.forEach((item) => {
    comments = [
      ...comments,
      ...item.comments
    ];
  });

  res.render(`comments`, {isLogin: true, comments});
});

export default router;
