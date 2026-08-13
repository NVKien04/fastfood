import DataSource from '@/data-source';
import { MasterSeed } from '@/database/seeders/master.seed';

async function bootstrap() {
  console.log('🔌 Initializing Database DataSource...');
  await DataSource.initialize();

  try {
    await DataSource.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'product_variants_size_enum' AND e.enumlabel = '1 Miếng') THEN
          ALTER TYPE product_variants_size_enum ADD VALUE '1 Miếng';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'product_variants_size_enum' AND e.enumlabel = '2 Miếng') THEN
          ALTER TYPE product_variants_size_enum ADD VALUE '2 Miếng';
        END IF;
      END $$;
    `);
    await DataSource.query(
      `SELECT setval(pg_get_serial_sequence('category', 'id'), COALESCE((SELECT MAX(id) FROM category), 1));`,
    );
    await DataSource.query(
      `SELECT setval(pg_get_serial_sequence('ingredients', 'id'), COALESCE((SELECT MAX(id) FROM ingredients), 1));`,
    );
  } catch (e) {
    console.warn('⚠️ Pre-seeding migration/sequence sync warning:', e.message);
  }

  await MasterSeed(DataSource);

  await DataSource.destroy();
  console.log('👋 Database connection closed.');
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
