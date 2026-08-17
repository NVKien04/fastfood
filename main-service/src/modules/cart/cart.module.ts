import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from '@/modules/cart/application/services/cart.service';
import { CartController } from '@/modules/cart/presentation/controllers/cart.controller';
import { CartTypeOrmRepository } from '@/modules/cart/infrastructure/repositories/cart.typeorm.repository';
import {
  CartEntity,
  CartItemsEntity,
  CartItemIngredientsEntity,
  ProductEntity,
  ProductVariantsEntity,
  IngredientsEntity,
} from '@/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemsEntity,
      CartItemIngredientsEntity,
      ProductEntity,
      ProductVariantsEntity,
      IngredientsEntity,
    ]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: 'ICartRepository',
      useClass: CartTypeOrmRepository,
    },
  ],
  exports: [CartService, 'ICartRepository'],
})
export class CartModule {}
