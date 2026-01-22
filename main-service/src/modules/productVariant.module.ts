import { ProductVariantsEntity } from '#src/entities/product_variants';
import { ProductVariantRepository } from '#src/repositories/productVariant/productVariant.repository';
import { ProductVariantService } from '#src/services/productVariant.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

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
