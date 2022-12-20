import {Router} from 'express';
import {getDefaultAPI} from '../api.js';
import moment from 'moment';
import {upload} from '../middlewares/uploader.js';

const api = getDefaultAPI();


const router = new Router();

router.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories({withCount: true})
  ]);

  res.render(`articles`, {articles, categories});
});

router.get(`/add`, async (req, res) => {
  const categories = await api.getCategories({withCount: false});
  const dateNowISO = moment(Date.now()).toISOString();

  const dataForm = {
    title: ``,
    categories: [],
    announce: ``,
    fullText: ``
  };

  res.render(`add-post`, {dataForm, dateNowISO, categories});
});

router.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const article = await api.getOneArticle(id);

    res.render(`article`, {article, editMode: true});
  } catch ({response: {status}}) {
    if (status === 404 || status === 500) {
      res.render(`errors/${status}`);
    }
  }
});

router.get(`/category/:id`, (req, res) => {
  // все публикации в данной категории
  res.render(`articles`);
});

router.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article] = await Promise.all([
      api.getOneArticle(id)
    ]);
    res.render(`article`, {article});
  } catch ({response: {status}}) {
    if (status === 404 || status === 500) {
      res.render(`errors/${status}`);
    }
  }
});

router.post(`/add`,
    upload.single(`upload`),
    async ({body, file}, res) => {

      const dataForm = {
        photo: file || ``,
        createdDate: body[`date`],
        title: body[`title`],
        categories: body[`category`],
        announce: body[`announce`],
        fullText: body[`full-text`]
      };


      try {
        await api.createArticle(dataForm);
        res.redirect(`/my`);

      } catch (e) {
        console.log(`Error:`, e.response.data);
        const categories = await api.getCategories();

        res.render(`add-post`,
            {
              dataForm,
              categories,
              dateNowISO: dataForm.createdDate
            });
      }
    });

export default router;
