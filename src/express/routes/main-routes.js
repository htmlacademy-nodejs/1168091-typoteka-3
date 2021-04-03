'use strict';

const {Router} = require(`express`);

const router = new Router();

router.get(`/`, (req, res) => res.render(`main`));
router.get(`/register`, (req, res) => res.render(`registration`));
router.get(`/login`, (req, res) => res.render(`login`));
router.get(`/search`, (req, res) => res.render(`search`));
router.get(`/categories`, (req, res) => res.render(`categories`));

module.exports = router;
