import {Router} from 'express';
import {getDefaultAPI} from '../api.js';

const router = new Router();
const api = getDefaultAPI();


router.get(`/`, (req, res) => res.render(`main`));
router.get(`/register`, (req, res) => res.render(`registration`));
router.get(`/login`, (req, res) => res.render(`login`));
router.get(`/search`, async (req, res) => {
  const {search} = req.query;
  try {
    const result = await api.search(search);
    res.render(`search`, {result, search});
  } catch (e) {
    res.render(`search`, {result: [], search});
  }
});
router.get(`/categories`, (req, res) => res.render(`categories`));

export default router;
