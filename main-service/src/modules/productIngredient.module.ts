import { ProductIngredientsEntity } from '#src/entities/product_ingredients';
import { ProductIngredientRepository } from '#src/repositories/productIngredient/productIngredient.repository';
import { ProductIngredientService } from '#src/services/productIngredient.Service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

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
