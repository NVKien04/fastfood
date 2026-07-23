import { ProductController } from '#src/controllers/product.controller';
import { ProductEntity } from '#src/entities/product.entity';
import { ProductRepository } from '#src/repositories/product/product.repository';
import { ProductService } from '#src/services/product.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category.module';
import { OrderItemsEntity } from '#src/entities/order-items.entity';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients';
import { ProductVariantsEntity } from '#src/entities/product_variants';
import { ProductVariantModule } from './productVariant.module';
import { ProductIngredientModule } from './productIngredient.module';
import { IngredientModule } from './ingredient.module';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
  ],

  exports: [ProductService],
  imports: [
    TypeOrmModule.forFeature([ProductEntity, OrderItemsEntity, ProductVariantsEntity, ProductIngredientsEntity]),
    CategoryModule,
    ProductVariantModule,
    ProductIngredientModule,
    IngredientModule,
  ],
})
export class ProductModule {}
