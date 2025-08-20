import * as Joi from 'joi';
export const ValidationSchema = Joi.object({
  // 기본 설정
  NODE_ENV: Joi.string()
    .valid('production', 'development', 'local', 'test', 'provision')
    .default('local'),
  POOL_SIZE: Joi.number().required(),
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
  REDIS_MASTER_HOST: Joi.string().required(),
  REDIS_SLAVE1_HOST: Joi.string().required(),
  REDIS_SLAVE2_HOST: Joi.string().required(),
  REDIS_PASS: Joi.string().required(),
  REDIS_MASTER_PORT: Joi.number().required(),
  REDIS_SLAVE1_PORT: Joi.number().required(),
  REDIS_SLAVE2_PORT: Joi.number().required(),
  // Jwt 설정
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_EXP: Joi.string().required(),
  JWT_REFRESH_EXP: Joi.string().required(),
  JWT_ACCESS_REDIS_TTL: Joi.number().required(),
  JWT_REFRESH_REDIS_TTL: Joi.number().required(),
});
