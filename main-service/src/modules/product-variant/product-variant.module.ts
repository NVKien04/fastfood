import { ProductVariantsEntity } from '#src/entities/product_variants.entity';
import { ProductVariantRepository } from './repository/product-variant.repository';
import { ProductVariantService } from './product-variant.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantsEntity])],
  providers: [
    ProductVariantService,
    {
      provide: 'IProductVariantRepository',
      useClass: ProductVariantRepository,
    },
  ],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
