import {HttpCode} from "../const.js";
import {getErrolList} from "../utils.js";

export default (requiredFields) => (req, res, next) => {

  const newArticle = req.body;

  const errolList = getErrolList(requiredFields, newArticle);

  if (Object.keys(errolList).length) {
    res.status(HttpCode.BAD_REQUEST)
      .json(errolList);
    return;
  }

  next();
};
