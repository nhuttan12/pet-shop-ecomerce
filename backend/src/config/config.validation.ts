import * as Joi from 'joi';

export const schema = Joi.object({
  http: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
  }),
  db: Joi.object({
    mysql: Joi.object({
      host: Joi.string().required(),
      port: Joi.number().required(),
      database: Joi.string().required(),
      dialect: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
});
