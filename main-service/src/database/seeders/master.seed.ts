import { DataSource } from 'typeorm';
import { CategoryEntity } from '#src/entities/category.entity';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { ProductEntity } from '#src/entities/product.entity';
import { ProductVariantsEntity } from '#src/entities/product_variants.entity';
import { CombosEntity } from '#src/entities/combos.entity';

import { categories, ingredients, products, productVariants, combos } from './data';

export async function MasterSeed(dataSource: DataSource) {
  console.log('🌱 --- Starting Database Seeding ---');

  // 1. Seed Categories
  const categoryRepo = dataSource.getRepository(CategoryEntity);
  const categoryMap = new Map<number, CategoryEntity>();

  for (const item of categories) {
    let category = await categoryRepo.findOne({ where: { slug: item.slug } });
    if (!category) {
      category = categoryRepo.create({
        name: item.name,
        slug: item.slug,
        description: item.description,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
      });
      category = await categoryRepo.save(category);
      console.log(`✅ Seeded Category: ${category.name}`);
    } else {
      console.log(`⚠️ Category Existed: ${category.name}`);
    }
    categoryMap.set(item.id, category);
  }

  // 2. Seed Ingredients
  const ingredientRepo = dataSource.getRepository(IngredientsEntity);
  for (const item of ingredients) {
    const exists = await ingredientRepo.findOne({ where: { name: item.name } });
    if (!exists) {
      const ingredient = ingredientRepo.create({
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl || '',
        isActive: item.isActive,
        isRequired: item.isRequired,
        categoryId: categoryMap.get(item.categoryId)?.id || 1,
      });
      await ingredientRepo.save(ingredient);
      console.log(`✅ Seeded Ingredient: ${item.name}`);
    } else {
      console.log(`⚠️ Ingredient Existed: ${item.name}`);
    }
  }

  // 3. Seed Products
  const productRepo = dataSource.getRepository(ProductEntity);
  const productMap = new Map<number, ProductEntity>();

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    let product = await productRepo.findOne({ where: { slug: item.slug } });
    if (!product) {
      const dbCategory = categoryMap.get(item.categoryId);
      product = productRepo.create({
        name: item.name,
        slug: item.slug,
        description: item.description,
        basePrice: item.basePrice,
        sortOrder: item.sortOrder,
        img: item.img || '',
        isFeatured: item.isFeatured,
        categoryId: dbCategory?.id || 1,
        isActive: item.isActive,
      });
      product = await productRepo.save(product);
      console.log(`✅ Seeded Product: ${product.name}`);
    } else {
      console.log(`⚠️ Product Existed: ${product.name}`);
    }
    productMap.set(i + 1, product);
  }

  // 4. Seed Product Variants
  const variantRepo = dataSource.getRepository(ProductVariantsEntity);
  for (const item of productVariants) {
    const parentProduct = productMap.get(item.productId);
    if (!parentProduct) continue;

    const exists = await variantRepo.findOne({
      where: {
        productId: parentProduct.id,
        name: item.name,
      },
    });

    if (!exists) {
      const variant = variantRepo.create({
        name: item.name,
        size: item.size as any,
        type: item.type as any,
        modifiedPrice: item.modifiedPrice,
        isActive: item.isActive,
        sortOrder: item.sortOrder,
        productId: parentProduct.id,
      });
      await variantRepo.save(variant);
      console.log(`✅ Seeded Variant: ${item.name} for ${parentProduct.name}`);
    }
  }

  // 5. Seed Combos
  const comboRepo = dataSource.getRepository(CombosEntity);
  for (const item of combos) {
    const exists = await comboRepo.findOne({ where: { slug: item.slug } });
    if (!exists) {
      const combo = comboRepo.create({
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        img: item.img || '',
        sortOrder: item.sortOrder,
        isActive: item.isActive,
      });
      await comboRepo.save(combo);
      console.log(`✅ Seeded Combo: ${item.name}`);
    } else {
      console.log(`⚠️ Combo Existed: ${item.name}`);
    }
  }

  console.log('🎉 --- Seeding Completed Successfully ---');
}
