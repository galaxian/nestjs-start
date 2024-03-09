import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  SERVER_PORT: Joi.number().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().required(),

  ACCESSEXPIRE: Joi.number().required(),
  ACCESSSECRET: Joi.string().required(),
  REFRESHEXPIRE: Joi.number().required(),
  REFRESHSECRET: Joi.string().required(),
});
