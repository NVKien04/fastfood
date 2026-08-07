import { IngredientController } from './presentation/controllers/ingredient.controller';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients.entity';
import { OrderItemsIngredientsEntity } from '#src/entities/order-item-ingredients.entity';
import { IngredientTypeOrmRepository } from './infrastructure/repositories/ingredient.typeorm.repository';
import { IngredientService } from './application/services/ingredient.service';
import { Module } from '@nestjs/common';
import { CartItemIngredientsEntity } from '#src/entities/cart-item-ingredient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IngredientsEntity,
      CartItemIngredientsEntity,
      ProductIngredientsEntity,
      OrderItemsIngredientsEntity,
    ]),
  ],
  controllers: [IngredientController],
  providers: [
    IngredientService,
    {
      provide: 'IIngredientRepository',
      useClass: IngredientTypeOrmRepository,
    },
  ],
  exports: [IngredientService],
})
export class IngredientModule {}
