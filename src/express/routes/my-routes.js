import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import moment from 'moment';
import {asyncHandler, getPageSettings, prepareErrors, prepareErrorsWithFields} from '../../utils.js';
import {ARTICLES_PER_PAGE, DATE_FORMAT} from '../../const.js';
import author from '../middlewares/author.js';

const api = getDefaultAPI();
const myRoutes = new Router();

myRoutes.get(`/`, author, asyncHandler(
    async (req, res) => {
      const {page, limit, offset} = getPageSettings(req);
      const {user} = req.session;

      const result = await api.getArticles({comments: true, limit, offset});

      const {articles, count} = result;

      articles.forEach((article) => {
        article.date = moment(article.createdAt).format(DATE_FORMAT);
      });

      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

      res.render(`my`, {isLogin: true, articles, totalPages, page, user});
    }
));

myRoutes.get(`/comments`, author, asyncHandler(
    async (req, res) => {
      const {user} = req.session;
      const articles = await api.getArticles({comments: true});

      let comments = [];
      articles.forEach((item) => {
        comments = [
          ...comments,
          ...item.comments
        ];
      });

      res.render(`comments`, {comments, user});
    }
));

myRoutes.get(`/categories`, author, asyncHandler(
    async (req, res) => {
      const {user} = req.session;
      const {page, limit, offset} = getPageSettings(req);
      const {categories, count} = await api.getCategories({withCount: false, limit, offset});
      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
      res.render(`categories`, {categories, totalPages, page, user});
    }
));

myRoutes.post(`/categories`, author, asyncHandler(
    async (req, res) => {
      const newCategory = {
        name: req.body.name
      };
      const {user} = req.session;

      try {
        await api.createCategory(newCategory);
        res.redirect(`/categories`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const {page, limit, offset} = getPageSettings(req);
        const {categories, count} = await api.getCategories({withCount: false, limit, offset});
        const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
        res.render(`categories`, {categories, totalPages, page, validationMessages, name: req.body.name, user});
      }

    }
));

myRoutes.delete(`/categories`, author, asyncHandler(
    async (req, res) => {
      const {id} = req.body;
      const {user} = req.session;
      try {
        await api.deleteCategory(id);
        res.redirect(`/categories`);
      } catch (errors) {
        const validateMessagesWithFields = prepareErrorsWithFields(errors);
        const {page, limit, offset} = getPageSettings(req);
        const {categories, count} = await api.getCategories({withCount: false, limit, offset});
        const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
        res.render(`categories`, {categories, totalPages, page, validateMessagesWithFields, user});
      }
    }
));

myRoutes.put(`/categories`, author, asyncHandler(
    async (req, res) => {
      const {id, name} = req.body;
      const {user} = req.session;

      try {
        await api.updateCategory(id, name);
        res.redirect(`/categories`);
      } catch (errors) {
        const validateMessagesWithFields = prepareErrorsWithFields(errors);
        const {page, limit, offset} = getPageSettings(req);
        const {categories, count} = await api.getCategories({withCount: false, limit, offset});
        const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
        res.render(`categories`, {categories, totalPages, page, validateMessagesWithFields, user});
      }
    }
));

export default myRoutes;
