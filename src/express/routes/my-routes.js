import {Router} from 'express';

const router = new Router();

router.get(`/`, (req, res) => res.render(`my`, {isLogin: true}));
router.get(`/comments`, (req, res) => res.render(`comments`, {isLogin: true}));

export default router;
