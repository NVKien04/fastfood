import { IngredientController } from '@/modules/ingredient/presentation/controllers/ingredient.controller';
import { IngredientsEntity } from '@/entities/ingredients.entity';
import { ProductIngredientsEntity } from '@/entities/product_ingredients.entity';
import { OrderItemsIngredientsEntity } from '@/entities/order-item-ingredients.entity';
import { IngredientTypeOrmRepository } from '@/modules/ingredient/infrastructure/repositories/ingredient.typeorm.repository';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';
import { Module } from '@nestjs/common';
import { CartItemIngredientsEntity } from '@/entities/cart-item-ingredient.entity';
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
