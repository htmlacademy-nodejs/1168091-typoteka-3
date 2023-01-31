import Joi from "joi";
import {HttpCode} from "../../const.js";
import {createFormError} from "../../utils.js";

const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`,
  FIRST_NAME_NOT_EMPTY: `Поле 'Имя' не может быть пустым`,
  LAST_NAME_NOT_EMPTY: `Поле 'Фамилия' не может быть пустым`,
  PASS_NOT_EMPTY: `Поле 'Пароль' не может быть пустым`,
  EMAIL_NOT_EMPTY: `Поле 'Электронная' почта может быть пустым`,
  PASS_REPEAT_NOT_EMPTY: `Поле 'Повтор пароля' не может быть пустым`,
};

const schema = Joi.object({
  firstName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': createFormError(`firstName`, ErrorRegisterMessage.NAME),
    'any.required': createFormError(`firstName`, ErrorRegisterMessage.FIRST_NAME_NOT_EMPTY),
    'string.empty': createFormError(`firstName`, ErrorRegisterMessage.FIRST_NAME_NOT_EMPTY)
  }),
  lastName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': createFormError(`lastName`, ErrorRegisterMessage.NAME),
    'any.required': createFormError(`lastName`, ErrorRegisterMessage.LAST_NAME_NOT_EMPTY),
    'string.empty': createFormError(`lastName`, ErrorRegisterMessage.LAST_NAME_NOT_EMPTY)
  }),
  email: Joi.string().email().required().messages({
    'string.email': createFormError(`email`, ErrorRegisterMessage.EMAIL),
    'any.required': createFormError(`email`, ErrorRegisterMessage.EMAIL_NOT_EMPTY),
    'string.empty': createFormError(`email`, ErrorRegisterMessage.EMAIL_NOT_EMPTY)
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': createFormError(`password`, ErrorRegisterMessage.PASSWORD),
    'any.required': createFormError(`password`, ErrorRegisterMessage.PASS_NOT_EMPTY),
    'string.empty': createFormError(`password`, ErrorRegisterMessage.PASS_NOT_EMPTY)
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'any.only': createFormError(`passwordRepeated`, ErrorRegisterMessage.PASSWORD_REPEATED),
    'any.required': createFormError(`password`, ErrorRegisterMessage.PASS_REPEAT_NOT_EMPTY),
  }),
  avatar: Joi.string().required().allow(``, null)
});

export default (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
};
