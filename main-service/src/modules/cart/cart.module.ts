import { CartItemIngredientsEntity } from '@/entities/cart-item-ingredient.entity';
import { CartItemsEntity } from '@/entities/cart-items.entity';
import { CartEntity } from '@/entities/cart.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemsEntity, CartItemIngredientsEntity])],
})
export class CartModule {}
