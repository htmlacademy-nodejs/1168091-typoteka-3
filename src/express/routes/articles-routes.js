import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import moment from 'moment';
import {upload} from '../middlewares/uploader.js';
import {asyncHandler} from '../utils.js';

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

  article.date = moment(article.createdAt).format(`DD-MM-YYYY`);

  article.comments = article.comments.map((el) => ({
    ...el,
    date: moment(el.createdAt).format(`DD-MM-YYYY`)
  }));

  return article;
};

router.get(`/`, asyncHandler(
    async (req, res) => {
      const [articles, categories] = await Promise.all([
        api.getArticles({comments: true}),
        api.getCategories({withCount: true})
      ]);

      articles.forEach((article) => {
        article.date = moment(article.createdAt).format(`DD-MM-YYYY`);
      });

      res.render(`articles`, {articles, categories});
    }
));

router.get(`/category/:id`, asyncHandler(
    async (req, res) => {
      const {id} = req.params;

      const [articles, categories] = await Promise.all([
        api.getArticles({comments: true, categoryId: id}),
        api.getCategories({withCount: true})
      ]);

      res.render(`articles`, {articles, categories});
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
            createdDate: body[`date`]
          };

          try {
            console.log(`DataForm`, dataForm);
            await api.createArticle(dataForm);
            res.redirect(`/my`);

          } catch (e) {
            console.log(`Error:`, e);
            const categories = await api.getCategories({withCount: false});

            res.render(`add-post`,
                {
                  dataForm,
                  categories,
                  dateNowISO: dataForm.createdDate
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
            createdDate: body[`date`]
          };

          try {
            const data = {...dataForm};
            delete data.id;

            await api.updateArticle(id, data);

            res.redirect(`/my`);
          } catch (e) {
            console.log(`Error:`, e);
            const categories = await api.getCategories({withCount: false});

            res.render(`add-post`, {
              dataForm,
              dateNowISO: dataForm.createdDate,
              categories
            });
          }
        }
    ));

router.post(`/:id`, asyncHandler(
    async ({body, params: {id}}, res) => {

      const newComment = {fullText: body.message};

      try {
        await api.createComment(id, newComment);
        const article = await getArticle(id);

        res.render(`article`, {article});
      } catch (e) {
        console.log(`Error`, e);
      }
    }
));

export default router;
