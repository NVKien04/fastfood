import { DataSource } from 'typeorm';
import { CategoryEntity } from '@/entities/category.entity';
import { categories } from '@/database/seeders/data';

export async function CategoriesSeed(dataSource: DataSource) {
  const repo = dataSource.getRepository(CategoryEntity);

  for (const item of categories) {
    const exists = await repo.findOne({
      where: { slug: item.slug },
    });

    if (!exists) {
      const category = repo.create(item);
      await repo.save(category);
      console.log(`✅ Seeded category: ${item.name}`);
    } else {
      console.log(`⚠️ Category existed: ${item.name}`);
    }
  }
}
