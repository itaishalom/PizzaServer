// users-service/config.ts

export default {
  PORT: process.env.PORT || 3002,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/pizza-ordering',
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET'
};
