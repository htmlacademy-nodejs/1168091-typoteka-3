import chalk from "chalk";
import fs from "fs/promises";
import {ARTICLES_PER_PAGE} from "./const.js";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }

  return someArray;
};

const createRandomDate = () => {
  const maxDiff = Math.random() * 3 * 60 * 60 * 24 * 30 * 1000;
  const date = new Date(new Date().getTime() - maxDiff);

  return date.toISOString();
};

const getErrolList = (requireFields, gotFields) => {
  const errolList = {};

  const keys = Object.keys(gotFields);

  requireFields.forEach((key) => {
    if (!keys.includes(key)) {
      errolList[key] = `required field`;
    }
  });

  keys.forEach((key) => {
    if (!requireFields.includes(key)) {
      errolList[key] = `unknown field`;
    }
  });

  return errolList;

};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const asyncHandler = (fn) => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};


const getPageSettings = (req) => {
  const limit = ARTICLES_PER_PAGE;

  let {page = 1} = req.query;
  page = +page;

  if (!(typeof page === `number` && !isNaN(page))) {
    page = 1;
  }

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  return {page, limit, offset};

};

const createFormError = (fieldName, textError) => {
  return fieldName + `|` + textError;
};

const prepareErrorsWithFields = (errors) => {
  const arr = errors.response.data.split(`\n`);

  return arr.map((el) => {
    const temp = el.split(`|`);
    return {
      fieldName: temp[0],
      error: temp[1]
    };
  });
};

const prepareErrors = (errors) => {
  const arr = errors.response.data.split(`\n`);
  return arr.map((el) => {
    return el.split(`|`)[1];
  });
};


export {
  getRandomInt,
  shuffle,
  createRandomDate,
  getErrolList,
  readContent,
  asyncHandler,
  getPageSettings,
  prepareErrors,
  createFormError,
  prepareErrorsWithFields
};
