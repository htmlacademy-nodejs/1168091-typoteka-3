import {ARTICLES_PER_PAGE} from './const.js';

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

export {asyncHandler, getPageSettings};
