import { IngredientController } from '#src/controllers/ingredient.controller';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients';
import { OrderItemsIngredientsEntity } from '#src/entities/order-item-ingredients.entity';
import { IngredientsRepository } from '#src/repositories/ingredient/ingredient.repository';
import { IngredientService } from '#src/services/ingredient.service';
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
      useClass: IngredientsRepository,
    },
  ],

  exports: [IngredientService],
})
export class IngredientModule {}
