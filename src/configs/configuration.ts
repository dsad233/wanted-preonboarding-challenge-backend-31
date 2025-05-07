export default () => ({
  nodeEnv: process.env.NODE_ENV || 'local',
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    pass: process.env.DB_PASS,
  },
});
