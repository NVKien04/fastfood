import { CartItemIngredientsEntity } from '#src/entities/cart-item-ingredient.entity';
import { CartItemsEntity } from '#src/entities/cart-items.entity';
import { CartEntity } from '#src/entities/cart.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemsEntity,
      CartItemIngredientsEntity,
    ]),
  ],
})
export class CartModule {}
