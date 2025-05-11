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
});
