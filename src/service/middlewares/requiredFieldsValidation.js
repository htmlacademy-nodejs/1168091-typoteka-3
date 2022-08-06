import {HttpCode} from "../const.js";
import {getErrolList} from "../utils.js";

export default (requiredFields) => (req, res, next) => {

  const newArticle = req.body;

  const errolLisl = getErrolList(requiredFields, newArticle);

  if (Object.keys(errolLisl).length) {
    res.status(HttpCode.BAD_REQUEST)
      .json(errolLisl);
  }

  next();
};
