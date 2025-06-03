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
    cloudinary: Joi.object({
      name: Joi.string().required().messages({
        'string.base': MessageLog.CLOUDINARY_NAME_MUST_BE_A_STRING,
        'any.required': MessageLog.CLOUDINARY_NAME_IS_REQUIRED,
        'string.empty': MessageLog.CLOUDINARY_NAME_CANNOT_BE_EMPTY,
      }),
      api_key: Joi.string().required().messages({
        'string.base': MessageLog.CLOUDINARY_API_KEY_MUST_BE_A_STRING,
        'any.required': MessageLog.CLOUDINARY_API_KEY_IS_REQUIRED,
        'string.empty': MessageLog.CLOUDINARY_API_KEY_CANNOT_BE_EMPTY,
      }),
      api_secret: Joi.string().required().messages({
        'string.base': MessageLog.CLOUDINARY_API_SECRET_MUST_BE_A_STRING,
        'any.required': MessageLog.CLOUDINARY_API_SECRET_IS_REQUIRED,
        'string.empty': MessageLog.CLOUDINARY_API_SECRET_CANNOT_BE_EMPTY,
      }),
    }).required(),
    mail: Joi.object({
      app_password: Joi.string().required().messages({
        'string.base': MessageLog.APP_PASSWORD_MUST_BE_STRING,
        'any.required': MessageLog.APP_PASSWORD_REQUIRED,
        'string.empty': MessageLog.APP_PASSWORD_EMPTY,
      }),
      email: Joi.string().required().messages({
        'string.base': MessageLog.EMAIL_MUST_BE_STRING,
        'any.required': MessageLog.EMAIL_REQUIRED,
        'string.empty': MessageLog.EMAIL_EMPTY,
      }),
    }).required(),
    paypal: Joi.object({
      client_id: Joi.string().required().messages({
        'string.base': MessageLog.CLIENT_ID_MUST_BE_STRING,
        'any.required': MessageLog.CLIENT_ID_REQUIRED,
        'string.empty': MessageLog.CLIENT_ID_EMPTY,
      }),
      secret: Joi.string().required().messages({
        'string.base': MessageLog.SECRET_MUST_BE_STRING,
        'any.required': MessageLog.SECRET_REQUIRED,
        'string.empty': MessageLog.SECRET_EMPTY,
      }),
      environtment: Joi.string().required().messages({
        'string.base': MessageLog.ENVIRONMENT_MUST_BE_STRING,
        'any.required': MessageLog.ENVIRONMENT_REQUIRED,
        'string.empty': MessageLog.ENVIRONMENT_EMPTY,
      }),
    }).required(),
  }).required(),
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
    }).required(),
  }).required(),
  domain: Joi.object({
    client_1: Joi.object({
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
      reset_password: Joi.string().messages({
        'number.base': MessageLog.PORT_MUST_BE_NUMBER,
        'any.required': MessageLog.PORT_MUST_BE_NUMBER,
        'number.empty': MessageLog.PORT_CANNT_BE_EMPTY,
      }),
    }),
  }).required(),
}).required();
