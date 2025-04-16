import * as Joi from 'joi';

export const schema = Joi.object({
  http: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
  }),
  db: Joi.object({
    postgres: Joi.object({
      url: Joi.string().required(),
      port: Joi.number().required(),
      database: Joi.string().required(),
    }),
  }),
});
