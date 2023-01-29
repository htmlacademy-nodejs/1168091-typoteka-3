import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import moment from 'moment';
import {asyncHandler, getPageSettings} from '../../utils.js';
import {ARTICLES_PER_PAGE, DATE_FORMAT} from '../../const.js';

const api = getDefaultAPI();
const router = new Router();

router.get(`/`, asyncHandler(
    async (req, res) => {
      const {page, limit, offset} = getPageSettings(req);

      const result = await api.getArticles({comments: true, limit, offset});

      const {articles, count} = result;

      articles.forEach((article) => {
        article.date = moment(article.createdAt).format(DATE_FORMAT);
      });

      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

      res.render(`my`, {isLogin: true, articles, totalPages, page});
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
