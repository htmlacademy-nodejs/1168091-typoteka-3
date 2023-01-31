import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import {asyncHandler, getPageSettings, prepareErrors, prepareErrorsWithFields} from '../../utils.js';
import {ARTICLES_PER_PAGE, DATE_FORMAT} from '../../const.js';
import moment from 'moment';
import {upload} from '../middlewares/uploader.js';

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

router.post(`/register`,
    upload.single(`avatar`),
    asyncHandler(
        async ({body, file}, res) => {
          const dataForm = {
            email: body[`email`],
            firstName: body[`first-name`],
            lastName: body[`last-name`],
            password: body[`password`],
            passwordRepeated: body[`password-repeated`],
            avatar: file ? file.filename : ``
          };

          try {
            await api.createUser(dataForm);
            res.redirect(`/login`);
          } catch (errors) {
            const validationMessages = prepareErrors(errors);
            res.render(`registration`, {dataForm, validationMessages});
          }
        }
    ));

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
      const {page, limit, offset} = getPageSettings(req);
      const {categories, count} = await api.getCategories({withCount: false, limit, offset});
      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
      res.render(`categories`, {categories, totalPages, page});
    }
));

router.post(`/categories`, asyncHandler(
    async (req, res) => {
      const newCategory = {
        name: req.body.name
      };

      try {
        await api.createCategory(newCategory);
        res.redirect(`/categories`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const {page, limit, offset} = getPageSettings(req);
        const {categories, count} = await api.getCategories({withCount: false, limit, offset});
        const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
        res.render(`categories`, {categories, totalPages, page, validationMessages, name: req.body.name});
      }

    }
));

router.delete(`/categories`, asyncHandler(
    async (req, res) => {
      const {id} = req.body;

      try {
        await api.deleteCategory(id);
        res.redirect(`/categories`);
      } catch (errors) {
        const validateMessagesWithFields = prepareErrorsWithFields(errors);
        const {page, limit, offset} = getPageSettings(req);
        const {categories, count} = await api.getCategories({withCount: false, limit, offset});
        const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
        res.render(`categories`, {categories, totalPages, page, validateMessagesWithFields});
      }
    }
));

router.put(`/categories`, asyncHandler(
    async (req, res) => {
      const {id, name} = req.body;

      try {
        await api.updateCategory(id, name);
        res.redirect(`/categories`);
      } catch (errors) {
        const validateMessagesWithFields = prepareErrorsWithFields(errors);
        const {page, limit, offset} = getPageSettings(req);
        const {categories, count} = await api.getCategories({withCount: false, limit, offset});
        const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
        res.render(`categories`, {categories, totalPages, page, validateMessagesWithFields});
      }
    }
));

export default router;
