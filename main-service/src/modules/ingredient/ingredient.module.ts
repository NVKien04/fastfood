import { IngredientController } from '@/modules/ingredient/presentation/controllers/ingredient.controller';
import {
  CartItemIngredientsEntity,
  IngredientsEntity,
  OrderItemsIngredientsEntity,
  ProductIngredientsEntity,
} from '@/entities';
import { IngredientTypeOrmRepository } from '@/modules/ingredient/infrastructure/repositories/ingredient.typeorm.repository';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';
import { Module } from '@nestjs/common';
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
