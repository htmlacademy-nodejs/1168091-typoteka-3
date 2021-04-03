'use strict';

const {Router} = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.render(`my`, {isLogin: true}));
router.get(`/comments`, (req, res) => res.render(`comments`, {isLogin: true}));

module.exports = router;
