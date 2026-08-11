import { ProductController } from './presentation/controllers/product.controller';
import { ProductEntity } from '#src/entities/product.entity';
import { ProductTypeOrmRepository } from './infrastructure/repositories/product.typeorm.repository';
import { ProductService } from './application/services/product.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '#src/modules/category/category.module';
import { OrderItemsEntity } from '#src/entities/order-items.entity';
import { ProductVariantsEntity } from '#src/entities/product_variants.entity';
import { ProductVariantModule } from '#src/modules/product-variant/product-variant.module';
import { IngredientModule } from '#src/modules/ingredient/ingredient.module';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'IProductRepository',
      useClass: ProductTypeOrmRepository,
    },
  ],
  exports: [ProductService],
  imports: [
    TypeOrmModule.forFeature([ProductEntity, OrderItemsEntity, ProductVariantsEntity]),
    CategoryModule,
    ProductVariantModule,
    IngredientModule,
  ],
})
export class ProductModule {}
