'use strict';

const {Router} = require(`express`);
const fs = require(`fs`).promises;
const {FILE_NAME, HttpCode} = require(`../const`);

const router = new Router();

router.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = router;
