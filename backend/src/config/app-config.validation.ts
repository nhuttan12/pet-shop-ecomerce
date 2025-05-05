import * as Joi from 'joi';
import { MessageLog } from 'src/helper/message/message-log';

export const schema = Joi.object({
  http: Joi.object({
    host: Joi.string().required().messages({
      'string.base': MessageLog.HOST_MUST_BE_STRING,
      'any.required': MessageLog.HOST_MUST_BE_STRING,
      'string.empty': MessageLog.HOST_CANNT_BE_EMPTY,
    }),
    port: Joi.number().required().messages({
      'number.base': MessageLog.PORT_MUST_BE_NUMBER,
      'any.required': MessageLog.PORT_MUST_BE_NUMBER,
      'number.empty': MessageLog.PORT_CANNT_BE_EMPTY,
    }),
    jwtKey: Joi.string().required().messages({
      'string.base': MessageLog.JWT_KEY_MUST_BE_STRING,
      'any.required': MessageLog.JWT_KEY_IS_REQUIRED,
      'string.empty': MessageLog.JWT_KEY_CANNT_BE_EMPTY,
    }),
    expireTime: Joi.alternatives()
      .try(Joi.number(), Joi.string())
      .required()
      .messages({
        'alternatives.base': MessageLog.EXPIRE_TIME_MUST_BE_NUMBER_OR_STRING,
        'any.required': MessageLog.EXPIRE_TIME_IS_REQUIRED,
        'string.empty': MessageLog.EXPIRE_TIME_CANNT_BE_EMPTY,
      }),
  }),
  db: Joi.object({
    mysql: Joi.object({
      host: Joi.string().required().messages({
        'string.base': MessageLog.HOST_MUST_BE_STRING,
        'any.required': MessageLog.HOST_MUST_BE_STRING,
        'string.empty': MessageLog.HOST_CANNT_BE_EMPTY,
      }),
      port: Joi.number().required().messages({
        'number.base': MessageLog.PORT_MUST_BE_NUMBER,
        'any.required': MessageLog.PORT_MUST_BE_NUMBER,
        'number.empty': MessageLog.PORT_CANNT_BE_EMPTY,
      }),
      database: Joi.string().required().messages({
        'string.base': MessageLog.DATABASE_MUST_BE_STRING,
        'any.required': MessageLog.DATABASE_IS_REQUIRED,
        'string.empty': MessageLog.DATABASE_CANNT_BE_EMPTY,
      }),
      dialect: Joi.string().required().messages({
        'string.base': MessageLog.DIALECT_MUST_BE_STRING,
        'any.required': MessageLog.DIALECT_IS_REQUIRED,
        'string.empty': MessageLog.DIALECT_CANNT_BE_EMPTY,
      }),
      username: Joi.string().required().messages({
        'string.base': MessageLog.USERNAME_MUST_BE_STRING,
        'any.required': MessageLog.USERNAME_IS_REQUIRED,
        'string.empty': MessageLog.USERNAME_CANNT_BE_EMPTY,
      }),
      password: Joi.string().required().messages({
        'string.base': MessageLog.PASSWORD_MUST_BE_STRING,
        'any.required': MessageLog.PASSWORD_IS_REQUIRED,
        'string.empty': MessageLog.PASSWORD_CANNT_BE_EMPTY,
      }),
    }),
  }),
});
