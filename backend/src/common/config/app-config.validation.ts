import { CloudinaryConfigErrorMessage } from '@config/messages/cloudinary-config.error-messages';
import { DatabaseConfigErrorMessage } from '@config/messages/database-config.error-messages';
import { DomainConfigErrorMessage } from '@config/messages/domain-config.error-message';
import { EmailConfigErrorMessage } from '@config/messages/email-config.error-messages';
import { HttpErrorMessage } from '@config/messages/https.error-messages';
import { PaypalConfigErrorMessage } from '@config/messages/paypal-config.error-messages';
import Joi from 'joi';

export const schema = Joi.object({
  http: Joi.object({
    host: Joi.string().required().messages({
      'string.base': HttpErrorMessage.HOST_MUST_BE_STRING,
      'any.required': HttpErrorMessage.HOST_MUST_BE_STRING,
      'string.empty': HttpErrorMessage.HOST_CANNT_BE_EMPTY,
    }),
    port: Joi.number().required().messages({
      'number.base': HttpErrorMessage.PORT_MUST_BE_NUMBER,
      'any.required': HttpErrorMessage.PORT_MUST_BE_NUMBER,
      'number.empty': HttpErrorMessage.PORT_CANNT_BE_EMPTY,
    }),
    jwtKey: Joi.string().required().messages({
      'string.base': HttpErrorMessage.JWT_KEY_MUST_BE_STRING,
      'any.required': HttpErrorMessage.JWT_KEY_IS_REQUIRED,
      'string.empty': HttpErrorMessage.JWT_KEY_CANNT_BE_EMPTY,
    }),
    expireTime: Joi.alternatives()
      .try(Joi.number(), Joi.string())
      .required()
      .messages({
        'alternatives.base':
          HttpErrorMessage.EXPIRE_TIME_MUST_BE_NUMBER_OR_STRING,
        'any.required': HttpErrorMessage.EXPIRE_TIME_IS_REQUIRED,
        'string.empty': HttpErrorMessage.EXPIRE_TIME_CANNT_BE_EMPTY,
      }),
    cloudinary: Joi.object({
      name: Joi.string().required().messages({
        'string.base':
          CloudinaryConfigErrorMessage.CLOUDINARY_NAME_MUST_BE_A_STRING,
        'any.required':
          CloudinaryConfigErrorMessage.CLOUDINARY_NAME_IS_REQUIRED,
        'string.empty':
          CloudinaryConfigErrorMessage.CLOUDINARY_NAME_CANNOT_BE_EMPTY,
      }),
      api_key: Joi.string().required().messages({
        'string.base':
          CloudinaryConfigErrorMessage.CLOUDINARY_API_KEY_MUST_BE_A_STRING,
        'any.required':
          CloudinaryConfigErrorMessage.CLOUDINARY_API_KEY_IS_REQUIRED,
        'string.empty':
          CloudinaryConfigErrorMessage.CLOUDINARY_API_KEY_CANNOT_BE_EMPTY,
      }),
      api_secret: Joi.string().required().messages({
        'string.base':
          CloudinaryConfigErrorMessage.CLOUDINARY_API_SECRET_MUST_BE_A_STRING,
        'any.required':
          CloudinaryConfigErrorMessage.CLOUDINARY_API_SECRET_IS_REQUIRED,
        'string.empty':
          CloudinaryConfigErrorMessage.CLOUDINARY_API_SECRET_CANNOT_BE_EMPTY,
      }),
    }).required(),
    mail: Joi.object({
      app_password: Joi.string().required().messages({
        'string.base': EmailConfigErrorMessage.APP_PASSWORD_MUST_BE_STRING,
        'any.required': EmailConfigErrorMessage.APP_PASSWORD_REQUIRED,
        'string.empty': EmailConfigErrorMessage.APP_PASSWORD_EMPTY,
      }),
      email: Joi.string().required().messages({
        'string.base': EmailConfigErrorMessage.EMAIL_MUST_BE_STRING,
        'any.required': EmailConfigErrorMessage.EMAIL_REQUIRED,
        'string.empty': EmailConfigErrorMessage.EMAIL_EMPTY,
      }),
    }).required(),
    paypal: Joi.object({
      client_id: Joi.string().required().messages({
        'string.base': PaypalConfigErrorMessage.CLIENT_ID_MUST_BE_STRING,
        'any.required': PaypalConfigErrorMessage.CLIENT_ID_REQUIRED,
        'string.empty': PaypalConfigErrorMessage.CLIENT_ID_EMPTY,
      }),
      secret: Joi.string().required().messages({
        'string.base': PaypalConfigErrorMessage.SECRET_MUST_BE_STRING,
        'any.required': PaypalConfigErrorMessage.SECRET_REQUIRED,
        'string.empty': PaypalConfigErrorMessage.SECRET_EMPTY,
      }),
      environment: Joi.string().required().messages({
        'string.base': PaypalConfigErrorMessage.ENVIRONMENT_MUST_BE_STRING,
        'any.required': PaypalConfigErrorMessage.ENVIRONMENT_REQUIRED,
        'string.empty': PaypalConfigErrorMessage.ENVIRONMENT_EMPTY,
      }),
      return_url: Joi.string().required().messages({
        'string.base': PaypalConfigErrorMessage.RETURN_URL_MUST_BE_STRING,
        'any.required': PaypalConfigErrorMessage.RETURN_URL_REQUIRED,
        'string.empty': PaypalConfigErrorMessage.RETURN_URL_EMPTY,
      }),
      cancel_url: Joi.string().required().messages({
        'string.base': PaypalConfigErrorMessage.CANCEL_URL_MUST_BE_STRING,
        'any.required': PaypalConfigErrorMessage.CANCEL_URL_REQUIRED,
        'string.empty': PaypalConfigErrorMessage.CANCEL_URL_EMPTY,
      }),
    }).required(),
  }).required(),
  db: Joi.object({
    mysql: Joi.object({
      host: Joi.string().required().messages({
        'string.base': DatabaseConfigErrorMessage.HOST_MUST_BE_STRING,
        'any.required': DatabaseConfigErrorMessage.HOST_MUST_BE_STRING,
        'string.empty': DatabaseConfigErrorMessage.HOST_CANNT_BE_EMPTY,
      }),
      port: Joi.number().required().messages({
        'number.base': DatabaseConfigErrorMessage.PORT_MUST_BE_NUMBER,
        'any.required': DatabaseConfigErrorMessage.PORT_MUST_BE_NUMBER,
        'number.empty': DatabaseConfigErrorMessage.PORT_CANNT_BE_EMPTY,
      }),
      database: Joi.string().required().messages({
        'string.base': DatabaseConfigErrorMessage.DATABASE_MUST_BE_STRING,
        'any.required': DatabaseConfigErrorMessage.DATABASE_IS_REQUIRED,
        'string.empty': DatabaseConfigErrorMessage.DATABASE_CANNT_BE_EMPTY,
      }),
      dialect: Joi.string().required().messages({
        'string.base': DatabaseConfigErrorMessage.DIALECT_MUST_BE_STRING,
        'any.required': DatabaseConfigErrorMessage.DIALECT_IS_REQUIRED,
        'string.empty': DatabaseConfigErrorMessage.DIALECT_CANNT_BE_EMPTY,
      }),
      username: Joi.string().required().messages({
        'string.base': DatabaseConfigErrorMessage.USERNAME_MUST_BE_STRING,
        'any.required': DatabaseConfigErrorMessage.USERNAME_IS_REQUIRED,
        'string.empty': DatabaseConfigErrorMessage.USERNAME_CANNT_BE_EMPTY,
      }),
      password: Joi.string().required().messages({
        'string.base': DatabaseConfigErrorMessage.PASSWORD_MUST_BE_STRING,
        'any.required': DatabaseConfigErrorMessage.PASSWORD_IS_REQUIRED,
        'string.empty': DatabaseConfigErrorMessage.PASSWORD_CANNT_BE_EMPTY,
      }),
    }).required(),
  }).required(),
  domain: Joi.object({
    client_1: Joi.object({
      host: Joi.string().required().messages({
        'string.base': DomainConfigErrorMessage.HOST_MUST_BE_STRING,
        'any.required': DomainConfigErrorMessage.HOST_MUST_BE_STRING,
        'string.empty': DomainConfigErrorMessage.HOST_CANNT_BE_EMPTY,
      }),
      port: Joi.number().required().messages({
        'number.base': DomainConfigErrorMessage.PORT_MUST_BE_NUMBER,
        'any.required': DomainConfigErrorMessage.PORT_MUST_BE_NUMBER,
        'number.empty': DomainConfigErrorMessage.PORT_CANNT_BE_EMPTY,
      }),
      reset_password: Joi.string().messages({
        'number.base': DomainConfigErrorMessage.PORT_MUST_BE_NUMBER,
        'any.required': DomainConfigErrorMessage.PORT_MUST_BE_NUMBER,
        'number.empty': DomainConfigErrorMessage.PORT_CANNT_BE_EMPTY,
      }),
    }),
  }).required(),
}).required();
