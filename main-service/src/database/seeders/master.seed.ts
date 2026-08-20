import { DataSource } from 'typeorm';
import {
  CategoryEntity,
  CombosEntity,
  IngredientsEntity,
  ProductEntity,
  ProductIngredientsEntity,
  ProductVariantsEntity,
} from '@/entities';
import { SizeEnum, TypeEnum } from '@/enums';

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

  for (let i = 0; i < categories.length; i++) {
    const item = categories[i];
    let category = await categoryRepo.findOne({ where: { slug: item.slug } });
    if (!category) {
      category = categoryRepo.create({
        name: item.name,
        slug: item.slug,
        description: item.description,
        sortOrder: item.sortOrder ?? i + 1,
        isActive: item.isActive ?? 1,
      });
      category = await categoryRepo.save(category);
      console.log(`✅ Seeded Category: ${category.name}`);
    } else {
      console.log(`⚠️ Category Existed: ${category.name}`);
    }
    categoryMap.set(i + 1, category);
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
        isActive: item.isActive ?? 1,
        isRequired: item.isRequired ?? 0,
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
        sortOrder: 'sortOrder' in item && typeof item.sortOrder === 'number' ? item.sortOrder : i + 1,
        img: item.img || '',
        isFeatured: item.isFeatured ?? 0,
        categoryId: dbCategory?.id || 1,
        isActive: item.isActive ?? 1,
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
  for (let i = 0; i < productVariants.length; i++) {
    const item = productVariants[i];
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
        size: (item.size as SizeEnum) || SizeEnum.SIZE_20,
        type: (item.type as TypeEnum) || TypeEnum.MEDIUM,
        modifiedPrice: item.modifiedPrice ?? 0,
        isActive: item.isActive ?? 1,
        sortOrder: 'sortOrder' in item && typeof item.sortOrder === 'number' ? item.sortOrder : i + 1,
        productId: parentProduct.id,
      });
      await variantRepo.save(variant);
      console.log(`✅ Seeded Variant: ${item.name} for ${parentProduct.name}`);
    }
  }

  // 5. Seed Combos
  const comboRepo = dataSource.getRepository(CombosEntity);
  for (let i = 0; i < combos.length; i++) {
    const item = combos[i];
    const exists = await comboRepo.findOne({ where: { slug: item.slug } });
    if (!exists) {
      const price =
        'price' in item && typeof item.price === 'number'
          ? item.price
          : 'basePrice' in item && typeof item.basePrice === 'number'
            ? item.basePrice
            : 0;

      const combo = comboRepo.create({
        name: item.name,
        slug: item.slug,
        description: item.description,
        price,
        img: item.img || '',
        sortOrder: 'sortOrder' in item && typeof item.sortOrder === 'number' ? item.sortOrder : i + 1,
        isActive: item.isActive ?? 1,
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
