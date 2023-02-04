import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import {asyncHandler, getPageSettings, prepareErrors} from '../../utils.js';
import {ARTICLES_PER_PAGE, DATE_FORMAT} from '../../const.js';
import moment from 'moment';
import {upload} from '../middlewares/uploader.js';

const router = new Router();
const api = getDefaultAPI();


router.get(`/`, asyncHandler(
    async (req, res) => {
      const {user} = req.session;
      const {page, limit, offset} = getPageSettings(req);
      const [{articles, count}, categories] = await Promise.all([
        api.getArticles({comments: true, limit, offset}),
        api.getCategories({withCount: true})
      ]);

      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

      articles.forEach((article) => {
        article.date = moment(article.createdAt).format(DATE_FORMAT);
      });

      res.render(`main`, {articles, categories, totalPages, page, user});
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

router.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

router.post(`/login`, asyncHandler(
    async (req, res) => {
      const {email, password} = req.body;

      try {
        const user = await api.auth(email, password);
        req.session.user = user;
        req.session.save(() => {
          res.redirect(`/`);
        });

      } catch (errors) {
        const validationMessages = prepareErrors(errors);
        const {user} = req.session;
        res.render(`login`, {user, validationMessages});
      }
    }
));

router.get(`/search`, asyncHandler(
    async (req, res) => {
      const {search} = req.query;
      const {user} = req.session;
      try {
        const result = await api.search(search);
        res.render(`search`, {result, search, user});
      } catch (e) {
        res.render(`search`, {result: [], search, user});
      }
    }
));

router.get(`/errors/404`, (req, res) => res.render(`errors/404`));

export default router;
