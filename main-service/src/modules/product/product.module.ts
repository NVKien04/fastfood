import { ProductController } from '@/modules/product/presentation/controllers/product.controller';
import { OrderItemsEntity, ProductEntity, ProductVariantsEntity } from '@/entities';
import { ProductTypeOrmRepository } from '@/modules/product/infrastructure/persistence/typeorm/product.typeorm.repository';
import { ProductService } from '@/modules/product/application/services/product.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '@/modules/category/category.module';
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
