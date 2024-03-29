import {HttpCode} from "../../const.js";

export default (service) => async (req, res, next) => {
  const {articleId} = req.params;
  const article = await service.findOne(articleId);

  if (!article) {
    res.status(HttpCode.NOT_FOUND)
      .send(`Article with ${articleId} not found`);
    return;
  }

  res.locals.article = article;
  next();
};
