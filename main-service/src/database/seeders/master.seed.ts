import { DataSource } from 'typeorm';
import {
  CategoryEntity,
  CombosEntity,
  IngredientsEntity,
  ProductEntity,
  ProductIngredientsEntity,
  ProductVariantsEntity,
} from '@/entities';

import {
  categories,
  ingredients,
  products,
  productVariants,
  combos,
  productIngredients,
} from '@/database/seeders/data';

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
  const ingredientMap = new Map<number, IngredientsEntity>();

  for (let i = 0; i < ingredients.length; i++) {
    const item = ingredients[i];
    let ingredient = await ingredientRepo.findOne({ where: { name: item.name } });
    if (!ingredient) {
      ingredient = ingredientRepo.create({
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl || '',
        isActive: item.isActive,
        isRequired: item.isRequired,
        categoryId: categoryMap.get(item.categoryId)?.id || 1,
      });
      ingredient = await ingredientRepo.save(ingredient);
      console.log(`✅ Seeded Ingredient: ${item.name}`);
    } else {
      console.log(`⚠️ Ingredient Existed: ${item.name}`);
    }
    ingredientMap.set(i + 1, ingredient);
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

  // 6. Seed Product Ingredients
  const productIngredientRepo = dataSource.getRepository(ProductIngredientsEntity);
  for (const item of productIngredients) {
    const parentProduct = productMap.get(item.productId);
    const parentIngredient = ingredientMap.get(item.ingredientId);
    if (!parentProduct || !parentIngredient) continue;

    const exists = await productIngredientRepo.findOne({
      where: {
        productId: parentProduct.id,
        ingredientId: parentIngredient.id,
      },
    });

    if (!exists) {
      const pi = productIngredientRepo.create({
        productId: parentProduct.id,
        ingredientId: parentIngredient.id,
        isDefault: item.isDefault,
        quantity: item.quantity,
      });
      await productIngredientRepo.save(pi);
      console.log(`✅ Seeded ProductIngredient: ${parentProduct.name} - ${parentIngredient.name}`);
    }
  }

  console.log('🎉 --- Seeding Completed Successfully ---');
}
