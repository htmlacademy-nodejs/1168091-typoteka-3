'use strict';

const {Router} = require(`express`);
const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);

const router = new Router();

router.use(`/`, mainRoutes);
router.use(`/my`, myRoutes);
router.use(`/articles`, articlesRoutes);

module.exports = router;
