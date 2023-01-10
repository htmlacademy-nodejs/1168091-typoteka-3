import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import moment from 'moment';
import {asyncHandler} from '../utils.js';

const api = getDefaultAPI();

const router = new Router();

router.get(`/`, asyncHandler(
    async (req, res) => {
      const articles = await api.getArticles({comments: true});

      articles.forEach((article) => {
        article.date = moment(article.createdAt).format(`DD-MM-YYYY`);
      });


      res.render(`my`, {isLogin: true, articles});
    }
));

router.get(`/comments`, asyncHandler(
    async (req, res) => {
      const articles = await api.getArticles({comments: true});

      let comments = [];
      articles.forEach((item) => {
        comments = [
          ...comments,
          ...item.comments
        ];
      });

      res.render(`comments`, {isLogin: true, comments});
    }
));

export default router;
