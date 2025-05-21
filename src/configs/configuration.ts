export default () => ({
  // 기본 설정
  nodeEnv: process.env.NODE_ENV || 'local',
  port: Number(process.env.PORT) || 3000,
  // 디비 설정
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME,
    pass: process.env.DB_PASS,
  },
  // Redis 설정
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    db: Number(process.env.REDIS_DB),
  },
  // Jwt 설정
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    exp: process.env.JWT_ACCESS_EXP,
    refreshExp: process.env.JWT_REFRESH_EXP,
    tokenTtl: process.env.JWT_ACCESS_REDIS_TTL,
    refreshTokenTtl: process.env.JWT_REFRESH_REDIS_TTL,
  },
});
