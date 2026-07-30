import DataSource from '../data-source';
import { MasterSeed } from './seeders/master.seed';

async function bootstrap() {
  console.log('🔌 Initializing Database DataSource...');
  await DataSource.initialize();

  await MasterSeed(DataSource);

  await DataSource.destroy();
  console.log('👋 Database connection closed.');
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
