import Joi from "joi";
import {HttpCode} from "../../const.js";
import {createFormError} from "../../utils.js";

const ErrorCommentCategory = {
  MIN: `Имя категории содержит меньше 5 символов`,
  MAX: `Имя категории содержит больше 20 символов`,
  NOT_EMPTY: `Поле не может быть пустым`
};

const schema = Joi.object({
  name: Joi.string().min(5).max(20).required().messages({
    'string.min': createFormError(`name`, ErrorCommentCategory.MIN),
    'string.max': createFormError(`name`, ErrorCommentCategory.MAX),
    'any.required': createFormError(`name`, ErrorCommentCategory.NOT_EMPTY),
    'string.empty': createFormError(`name`, ErrorCommentCategory.NOT_EMPTY),
  })
});

export default (req, res, next) => {
  const data = req.body;

  const {error} = schema.validate(data, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
