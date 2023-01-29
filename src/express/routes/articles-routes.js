import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import moment from 'moment';
import {upload} from '../middlewares/uploader.js';
import {asyncHandler, getPageSettings, prepareErrors, prepareErrorsWithFields} from '../../utils.js';
import {ARTICLES_PER_PAGE, DATE_FORMAT} from '../../const.js';

const api = getDefaultAPI();

const router = new Router();

const getArticle = async (id) => {
  const [article, categories] = await Promise.all([
    api.getOneArticle(id),
    api.getCategories({withCount: true})
  ]);

  const newCategories = categories.reduce((target, key) => {
    target[key.id] = key.count;
    return target;
  }, {});

  article.categories = article.categories.map((el) => ({
    id: el.id,
    name: el.name,
    count: newCategories[el.id]
  }));

  article.date = moment(article.createdAt).format(DATE_FORMAT);

  article.comments = article.comments.map((el) => ({
    ...el,
    date: moment(el.createdAt).format(DATE_FORMAT)
  }));

  return article;
};

router.get(`/`, asyncHandler(
    async (req, res) => {
      const {page, limit, offset} = getPageSettings(req);

      const [{articles, count}, categories] = await Promise.all([
        api.getArticles({comments: true, limit, offset}),
        api.getCategories({withCount: true})
      ]);

      articles.forEach((article) => {
        article.date = moment(article.createdAt).format(DATE_FORMAT);
      });

      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

      res.render(`articles`, {articles, categories, totalPages, page});
    }
));

router.get(`/category/:id`, asyncHandler(
    async (req, res) => {
      const {id} = req.params;

      const {page, limit, offset} = getPageSettings(req);

      const [{articles, count}, categories] = await Promise.all([
        api.getArticles({comments: true, categoryId: id, limit, offset}),
        api.getCategories({withCount: true})
      ]);

      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

      res.render(`articles`, {articles, categories, totalPages, page});
    }
));

router.get(`/add`, asyncHandler(
    async (req, res) => {
      try {
        const categories = await api.getCategories({withCount: false});
        const dateNowISO = moment(Date.now()).toISOString();

        const dataForm = {
          title: ``,
          categories: [],
          announce: ``,
          fullText: ``,
          currentPictureName: ``
        };

        res.render(`add-post`, {
          dataForm,
          dateNowISO,
          categories
        });
      } catch ({response: {status}}) {
        if (status === 404 || status === 500) {
          res.render(`errors/${status}`);
        }
      }
    }
));

router.get(`/:id`, asyncHandler(
    async (req, res) => {
      const {id} = req.params;
      try {
        const article = await getArticle(id);

        res.render(`article`, {article});
      } catch ({response: {status}}) {
        if (status === 404 || status === 500) {
          res.render(`errors/${status}`);
        }
      }
    }
));

router.get(`/edit/:id`, asyncHandler(
    async (req, res) => {
      const {id} = req.params;
      try {
        const article = await api.getOneArticle(id);
        const categories = await api.getCategories({withCount: false});

        const dataForm = {
          id: article.id,
          title: article.title,
          categories: article.categories.map((el) => el.id),
          announce: article.announce,
          fullText: article.fullText,
          currentPictureName: article.picture
        };

        const dateNowISO = article.createdAt;

        res.render(`add-post`, {
          dataForm,
          dateNowISO,
          categories
        });

      } catch ({response: {status}}) {
        if (status === 404 || status === 500) {
          res.render(`errors/${status}`);
        }
      }
    }
));


router.post(`/add`,
    upload.single(`picture`),
    asyncHandler(
        async ({body, file}, res) => {

          const dataForm = {
            categories: Array.isArray(body[`category`]) ? body[`category`] : [body[`category`]],
            title: body[`title`],
            announce: body[`announce`],
            fullText: body[`full-text`],
            picture: file ? file.filename : null,
            createdDate: body[`date`],
            userId: 1
          };

          try {
            await api.createArticle(dataForm);
            res.redirect(`/my`);

          } catch (errors) {
            const validationMessages = prepareErrors(errors);
            const validateMessagesWithFields = prepareErrorsWithFields(errors);
            const categories = await api.getCategories({withCount: false});

            res.render(`add-post`,
                {
                  dataForm,
                  categories,
                  dateNowISO: dataForm.createdDate,
                  validationMessages,
                  validateMessagesWithFields
                });
          }
        }
    ));

router.post(`/edit/:id`,
    upload.single(`picture`),
    asyncHandler(
        async ({body, file, params}, res) => {
          const {id} = params;

          const currentPictureName = body[`pictureName`];

          const dataForm = {
            id,
            categories: Array.isArray(body[`category`]) ? body[`category`] : [body[`category`]],
            title: body[`title`],
            announce: body[`announce`],
            fullText: body[`full-text`],
            picture: file ? file.filename : currentPictureName,
            createdDate: body[`date`],
            userId: 1
          };

          try {
            const data = {...dataForm};
            delete data.id;

            await api.updateArticle(id, data);

            res.redirect(`/my`);
          } catch (errors) {
            console.log(`Error:`, errors);
            const validationMessages = prepareErrors(errors);
            const validateMessagesWithFields = prepareErrorsWithFields(errors);
            const categories = await api.getCategories({withCount: false});

            res.render(`add-post`, {
              dataForm,
              dateNowISO: dataForm.createdDate,
              categories,
              validationMessages,
              validateMessagesWithFields
            });
          }
        }
    ));

router.post(`/:id`, asyncHandler(
    async ({body, params: {id}}, res) => {

      const newComment = {
        fullText: body.fullText,
        userId: 2
      };

      try {
        await api.createComment(id, newComment);
        res.redirect(`/articles/${id}`);
      } catch (errors) {
        const validationMessages = prepareErrors(errors);

        const article = await getArticle(id);

        res.render(`article`, {
          article,
          validationMessages,
          fullText: newComment.fullText
        });
      }
    }
));

export default router;
