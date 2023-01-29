import Joi from "joi";
import {HttpCode} from "../../const.js";
import {createFormError} from "../../utils.js";

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  USER_ID: `Некорректный идентификатор пользователя`,
  NOT_EMPTY: `Комментарий не может быть пустым`
};

const schema = Joi.object({
  fullText: Joi.string().min(20).required().messages({
    'string.min': createFormError(`fullText`, ErrorCommentMessage.TEXT),
    'any.required': createFormError(`fullText`, ErrorCommentMessage.NOT_EMPTY),
    'string.empty': createFormError(`fullText`, ErrorCommentMessage.NOT_EMPTY),
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': createFormError(`userId`, ErrorCommentMessage.USER_ID)
  })
});

export default (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
