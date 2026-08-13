import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '@/entities/cart.entity';
import { CartItemsEntity } from '@/entities/cart-items.entity';
import { CartItemIngredientsEntity } from '@/entities/cart-item-ingredient.entity';
import { ProductEntity } from '@/entities/product.entity';
import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { IngredientsEntity } from '@/entities/ingredients.entity';
import { CartService } from './application/services/cart.service';
import { CartController } from './presentation/controllers/cart.controller';
import { CartTypeOrmRepository } from './infrastructure/repositories/cart.typeorm.repository';

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
