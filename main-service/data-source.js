const { DataSource } = require('typeorm');
require('dotenv').config();

module.exports = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: false,
  logging: true,

  entities: ['dist/entities/**/*.js'],
  migrations: ['dist/database/migrations/*.js'],
});
