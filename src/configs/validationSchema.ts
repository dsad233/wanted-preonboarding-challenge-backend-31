import * as Joi from 'joi';
export const ValidationSchema = Joi.object({
  // 기본 설정
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision', 'local')
    .default('local'),
  TZ: Joi.string().required(),
  PORT: Joi.number().port().default(3000),
  // 디비 설정
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  // Redis 설정
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_DB: Joi.number().required(),
});
