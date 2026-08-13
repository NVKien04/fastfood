import { ProductController } from '@/modules/product/presentation/controllers/product.controller';
import { ProductEntity } from '@/entities/product.entity';
import { ProductTypeOrmRepository } from '@/modules/product/infrastructure/repositories/product.typeorm.repository';
import { ProductService } from '@/modules/product/application/services/product.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '@/modules/category/category.module';
import { OrderItemsEntity } from '@/entities/order-items.entity';
import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { ProductVariantModule } from '@/modules/product-variant/product-variant.module';
import { IngredientModule } from '@/modules/ingredient/ingredient.module';

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
