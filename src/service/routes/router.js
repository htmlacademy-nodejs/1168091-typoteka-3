import {Router} from "express";
import fs from "fs/promises";
import {FILE_NAME, HttpCode} from "../const.js";
import chalk from "chalk";

const router = new Router();

router.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME, `utf8`);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.json([]);
    res.status(HttpCode.INTERNAL_SERVER_ERROR);
    console.log(chalk.red(err));
  }
});

export default router;
