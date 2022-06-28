import {Router} from 'express';

const router = new Router();

router.get(`/add`, (req, res) => res.render(`add-post`));
router.get(`/edit/:id`, (req, res) => res.render(`articles-by-category`));
router.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
router.get(`/:id`, (req, res) => res.render(`article`));

export default router;
