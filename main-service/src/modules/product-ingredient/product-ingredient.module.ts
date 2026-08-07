import { ProductIngredientsEntity } from '#src/entities/product_ingredients.entity';
import { ProductIngredientRepository } from './infrastructure/repositories/product-ingredient.repository';
import { ProductIngredientService } from './application/services/product-ingredient.service';
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
