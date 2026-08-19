import { ProductVariantsEntity } from '@/entities';
import { ProductVariantRepository } from '@/modules/product-variant/infrastructure/persistence/typeorm/product-variant.repository';
import { ProductVariantService } from '@/modules/product-variant/application/services/product-variant.service';
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
