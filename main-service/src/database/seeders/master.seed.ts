import { DataSource } from 'typeorm';
import {
  CategoryEntity,
  CombosEntity,
  CouponsEntity,
  IngredientsEntity,
  NotificationEntity,
  OrderItemsEntity,
  OrderItemsIngredientsEntity,
  OrdersEntity,
  ProductEntity,
  ProductIngredientsEntity,
  ProductVariantsEntity,
  UserCouponsEntity,
  UserEntity,
} from '@/entities';
import { NotificationType, OrderStatus, PaymentMethod, PaymentStatus, RoleEnum, SizeEnum, TypeEnum } from '@/enums';
import { HashUtil } from '@/utils';

import {
  categories,
  ingredients,
  products,
  productVariants,
  combos,
  productIngredients,
  users,
  coupons,
  userCoupons,
  notifications,
  seedOrders,
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
        salePrice: 'salePrice' in item && typeof item.salePrice === 'number' ? item.salePrice : null,
        sortOrder: 'sortOrder' in item && typeof item.sortOrder === 'number' ? item.sortOrder : i + 1,
        img: item.img || '',
        isFeatured: item.isFeatured ?? 0,
        categoryId: dbCategory?.id || 1,
        isActive: item.isActive ?? 1,
      });
      product = await productRepo.save(product);
      console.log(`✅ Seeded Product: ${product.name}`);
    } else {
      // Cập nhật giá sale nếu có
      if ('salePrice' in item) {
        product.salePrice = typeof item.salePrice === 'number' ? item.salePrice : null;
        await productRepo.save(product);
      }
      console.log(`⚠️ Product Existed & Updated: ${product.name}`);
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

  // 7. Seed Users (Admin & Customers)
  const userRepo = dataSource.getRepository(UserEntity);
  const userMap = new Map<string, UserEntity>();
  const defaultHashedPassword = await HashUtil.hash('Password123');

  for (const item of users) {
    let user = await userRepo.findOne({ where: { email: item.email } });
    if (!user) {
      user = userRepo.create({
        email: item.email,
        name: item.name,
        phone: item.phone,
        role: item.role as RoleEnum,
        password: defaultHashedPassword,
        provider: item.provider || 'local',
      });
      user = await userRepo.save(user);
      console.log(`✅ Seeded User: ${user.email} (${user.role})`);
    } else {
      console.log(`⚠️ User Existed: ${user.email}`);
    }
    userMap.set(user.email, user);
  }

  // 8. Seed Coupons (Mã giảm giá đơn hàng & khuyến mãi)
  const couponRepo = dataSource.getRepository(CouponsEntity);
  const couponMap = new Map<string, CouponsEntity>();

  for (const item of coupons) {
    let coupon = await couponRepo.findOne({ where: { code: item.code } });
    if (!coupon) {
      coupon = couponRepo.create({
        code: item.code,
        name: item.name,
        description: item.description,
        value: item.value,
        minOrderAmount: item.minOrderAmount,
        maxUser: item.maxUser,
        currentUses: item.currentUses ?? 0,
        startDate: item.startDate,
        endDate: item.endDate,
        isActive: item.isActive ?? 1,
      });
      coupon = await couponRepo.save(coupon);
      console.log(`✅ Seeded Coupon: ${coupon.code} - Giảm ${coupon.value.toLocaleString('vi-VN')}đ`);
    } else {
      coupon.name = item.name;
      coupon.description = item.description;
      coupon.value = item.value;
      coupon.minOrderAmount = item.minOrderAmount;
      coupon.startDate = item.startDate;
      coupon.endDate = item.endDate;
      coupon.isActive = item.isActive ?? 1;
      coupon = await couponRepo.save(coupon);
      console.log(`⚠️ Coupon Existed & Synced: ${coupon.code}`);
    }
    couponMap.set(coupon.code, coupon);
  }

  // 9. Seed User Coupons (Gán mã giảm giá độc quyền cho từng User)
  const userCouponRepo = dataSource.getRepository(UserCouponsEntity);

  for (const item of userCoupons) {
    const user = userMap.get(item.userEmail) || (await userRepo.findOne({ where: { email: item.userEmail } }));
    const coupon = couponMap.get(item.couponCode) || (await couponRepo.findOne({ where: { code: item.couponCode } }));

    if (!user || !coupon) {
      console.warn(`⚠️ Cannot seed UserCoupon: User (${item.userEmail}) or Coupon (${item.couponCode}) not found`);
      continue;
    }

    const exists = await userCouponRepo.findOne({
      where: {
        userId: user.id,
        couponsId: coupon.id,
      },
    });

    if (!exists) {
      const uc = userCouponRepo.create({
        userId: user.id,
        couponsId: coupon.id,
        isUsed: item.isUsed ?? 0,
        userdAt: item.userdAt || null,
      });
      await userCouponRepo.save(uc);
      console.log(`✅ Seeded UserCoupon: [${user.email}] <-> [${coupon.code}]`);
    } else {
      console.log(`⚠️ UserCoupon Existed: [${user.email}] <-> [${coupon.code}]`);
    }
  }

  const notificationRepo = dataSource.getRepository(NotificationEntity);

  for (const item of notifications) {
    let targetUserId = item.userId;
    if (!targetUserId && item.userEmail) {
      const u = userMap.get(item.userEmail) || (await userRepo.findOne({ where: { email: item.userEmail } }));
      if (u) targetUserId = u.id;
    }

    if (!targetUserId) {
      const u = await userRepo.findOne({ where: { email: item.userEmail } });
      if (u) targetUserId = u.id;
    }

    if (!targetUserId) continue;

    const exists = await notificationRepo.findOne({
      where: {
        userId: targetUserId,
        title: item.title,
      },
    });

    if (!exists) {
      const notif = notificationRepo.create({
        title: item.title,
        content: item.content,
        type: item.type as NotificationType,
        isRead: item.isRead ?? false,
        userId: targetUserId,
        createdAt: item.createdAt || new Date(),
      });
      await notificationRepo.save(notif);
      console.log(`✅ Seeded Notification: "${item.title}" for user ${targetUserId}`);
    } else {
      console.log(`⚠️ Notification Existed: "${item.title}" for user ${targetUserId}`);
    }
  }

  // 11. Seed Orders for User
  const orderRepo = dataSource.getRepository(OrdersEntity);
  const orderItemRepo = dataSource.getRepository(OrderItemsEntity);
  const orderItemIngRepo = dataSource.getRepository(OrderItemsIngredientsEntity);

  for (const so of seedOrders) {
    const user = userMap.get(so.userEmail) || (await userRepo.findOne({ where: { email: so.userEmail } }));
    if (!user) continue;

    const existingOrder = await orderRepo.findOne({ where: { orderNumber: so.orderNumber } });
    if (existingOrder) {
      console.log(`⚠️ Order Existed: #${so.orderNumber}`);
      continue;
    }

    // Calculate subTotal and prepare items
    let subTotal = 0;
    const preparedItems: {
      productId: string;
      productVariantId: number | null;
      quantity: number;
      price: number;
      ingredientIds: number[];
    }[] = [];

    for (const it of so.items) {
      const prod = await productRepo.findOne({ where: { name: it.productName } });
      if (!prod) continue;

      let itemPrice = Number(prod.salePrice && prod.salePrice > 0 ? prod.salePrice : prod.basePrice);
      let variantId: number | null = null;

      if (it.variantName) {
        const variant = await variantRepo.findOne({ where: { productId: prod.id, name: it.variantName } });
        if (variant) {
          variantId = variant.id;
          itemPrice += Number(variant.modifiedPrice || 0);
        }
      }

      const ingIds: number[] = [];
      const itemWithIngs = it as { ingredientNames?: string[] };
      if (itemWithIngs.ingredientNames && itemWithIngs.ingredientNames.length > 0) {
        for (const ingName of itemWithIngs.ingredientNames) {
          const ing = await ingredientRepo.findOne({ where: { name: ingName } });
          if (ing) {
            ingIds.push(ing.id);
            itemPrice += Number(ing.price || 0);
          }
        }
      }

      subTotal += itemPrice * it.quantity;

      preparedItems.push({
        productId: prod.id,
        productVariantId: variantId,
        quantity: it.quantity,
        price: itemPrice,
        ingredientIds: ingIds,
      });
    }

    const total = Math.max(0, subTotal + so.deliveryFee - so.discount);

    const orderEntity = orderRepo.create({
      orderNumber: so.orderNumber,
      status: so.status as OrderStatus,
      paymentStatus: so.paymentStatus as PaymentStatus,
      paymentMethod: so.paymentMethod as PaymentMethod,
      subTotal,
      deliveryFee: so.deliveryFee,
      discount: so.discount,
      total,
      notes: so.notes,
      userId: user.id,
      guestName: so.guestName,
      guestPhone: so.guestPhone,
      guestAddress: so.guestAddress,
      createdAt: so.createdAt,
    });

    const savedOrder = await orderRepo.save(orderEntity);

    for (const pItem of preparedItems) {
      const oi = orderItemRepo.create({
        orderId: savedOrder.id,
        productId: pItem.productId,
        productVariantId: pItem.productVariantId,
        quantity: pItem.quantity,
        price: pItem.price,
      });
      const savedOi = await orderItemRepo.save(oi);

      for (const ingId of pItem.ingredientIds) {
        const oii = orderItemIngRepo.create({
          orderItemId: savedOi.id,
          ingredientId: ingId,
          quantity: 1,
        });
        await orderItemIngRepo.save(oii);
      }
    }

    console.log(
      `✅ Seeded Order: #${savedOrder.orderNumber} - Status: ${savedOrder.status} - Total: ${savedOrder.total.toLocaleString('vi-VN')}đ`,
    );
  }

  console.log('🎉 --- Seeding Completed Successfully ---');
}
