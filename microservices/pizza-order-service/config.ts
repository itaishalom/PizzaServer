
export default {
  PORT: process.env.PORT || 3003,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/pizza-ordering',
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET'
};
