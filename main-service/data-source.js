const { DataSource } = require('typeorm');
const path = require('path');
const dotenv = require('dotenv');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const isProd = process.env.NODE_ENV === 'production';
const isSsl = process.env.DB_SSL === 'true' || isProd || (!!dbUrl && dbUrl.includes('sslmode=require'));

const baseConfig = {
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/database/migrations/*.js'],
};

module.exports = new DataSource(
  dbUrl && dbUrl !== 'DATABASE_URL'
    ? {
        type: 'postgres',
        url: dbUrl,
        ssl: isSsl ? { rejectUnauthorized: false } : false,
        ...baseConfig,
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD ?? '',
        database: process.env.DB_NAME || 'fastfood',
        ssl: isSsl ? { rejectUnauthorized: false } : false,
        ...baseConfig,
      },
);
