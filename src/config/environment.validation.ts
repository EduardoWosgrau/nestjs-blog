import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5555),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().required().default(false),
  DATABASE_AUTOLOAD: Joi.boolean().required().default(false),
  PROFILE_API_KEY: Joi.string().required(),
});
