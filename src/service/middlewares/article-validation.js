import Joi from "joi";
import {HttpCode} from "../../const.js";
import {createFormError} from "../../utils.js";

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  CATEGORIES_NOT_EMPTY: `Категории не выбраны`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  TITLE_NOT_EMPTY: `Заголовок не может быть пустым`,
  ANNOUNCE_MIN: `Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать больше 250 символов`,
  ANNOUNCE_NOT_EMPTY: `Анонс не может быть пустым`,
  DESCRIPTION_MIN: `Описание содержит меньше 50 символов`,
  DESCRIPTION_MAX: `Описание не может содержать более 1000 символов`,
  DESCRIPTION_NOT_EMPTY: `Описание не может быть пустым`,
  PICTURE: `Тип изображения не поддерживается`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': createFormError(`title`, ErrorArticleMessage.TITLE_MIN),
    'string.max': createFormError(`title`, ErrorArticleMessage.TITLE_MAX),
    'any.required': createFormError(`title`, ErrorArticleMessage.TITLE_NOT_EMPTY),
    'string.empty': createFormError(`title`, ErrorArticleMessage.TITLE_NOT_EMPTY),
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': createFormError(`announce`, ErrorArticleMessage.ANNOUNCE_MIN),
    'string.max': createFormError(`announce`, ErrorArticleMessage.DESCRIPTION_MAX),
    'any.required': createFormError(`announce`, ErrorArticleMessage.ANNOUNCE_NOT_EMPTY),
    'string.empty': createFormError(`announce`, ErrorArticleMessage.ANNOUNCE_NOT_EMPTY),
  }),
  fullText: Joi.string().min(50).max(1000).required().messages({
    'string.min': createFormError(`fullText`, ErrorArticleMessage.DESCRIPTION_MIN),
    'string.max': createFormError(`fullText`, ErrorArticleMessage.DESCRIPTION_MAX),
    'any.required': createFormError(`fullText`, ErrorArticleMessage.DESCRIPTION_NOT_EMPTY),
    'string.empty': createFormError(`fullText`, ErrorArticleMessage.DESCRIPTION_NOT_EMPTY),
  }),
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': createFormError(`categories`, ErrorArticleMessage.CATEGORIES),
        'any.required': createFormError(`categories`, ErrorArticleMessage.CATEGORIES_NOT_EMPTY),
        'number.empty': createFormError(`categories`, ErrorArticleMessage.CATEGORIES_NOT_EMPTY),
      })
  ).min(1).required(),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': createFormError(`userId`, ErrorArticleMessage.USER_ID)
  }),
  picture: Joi.string().allow(``, null),
  createdDate: Joi.date().iso()
});

export default (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
