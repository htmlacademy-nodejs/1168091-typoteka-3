import {Router} from 'express';
import mainRoutes from './main-routes.js';
import myRoutes from './my-routes.js';
import articlesRoutes from './articles-routes.js';

const router = new Router();

router.use(`/`, mainRoutes);
router.use(`/my`, myRoutes);
router.use(`/articles`, articlesRoutes);

export default router;
