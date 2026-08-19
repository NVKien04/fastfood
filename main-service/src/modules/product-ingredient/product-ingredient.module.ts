import { ProductIngredientsEntity } from '@/entities';
import { ProductIngredientRepository } from '@/modules/product-ingredient/infrastructure/persistence/typeorm/product-ingredient.repository';
import { ProductIngredientService } from '@/modules/product-ingredient/application/services/product-ingredient.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductIngredientsEntity])],
  providers: [
    ProductIngredientService,
    {
      provide: 'IProductIngredientRepository',
      useClass: ProductIngredientRepository,
    },
  ],
  exports: [ProductIngredientService],
})
export class ProductIngredientModule {}
