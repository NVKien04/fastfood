// src/database/seed.ts
import DataSource from '../data-source';
import { CategoriesSeed } from './seeders/category.seed';

async function bootstrap() {
  await DataSource.initialize();

  console.log('🌱 Seeding...');
  await CategoriesSeed(DataSource);

  console.log('🌱 Done');
  await DataSource.destroy();
  process.exit(0);
}

bootstrap();
