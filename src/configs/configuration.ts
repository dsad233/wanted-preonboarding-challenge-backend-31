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
    poolSize: process.env.POOL_SIZE,
  },
  // Redis 설정
  redis: {
    host: process.env.REDIS_HOST,
    masterHost: process.env.REDIS_MASTER_HOST,
    slave1Host: process.env.REDIS_SLAVE1_HOST,
    slave2Host: process.env.REDIS_SLAVE2_HOST,
    pass: process.env.REDIS_PASS,
    masterPort: Number(process.env.REDIS_MASTER_PORT),
    slave1Port: Number(process.env.REDIS_SLAVE1_PORT),
    slave2Port: Number(process.env.REDIS_SLAVE2_PORT),
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
