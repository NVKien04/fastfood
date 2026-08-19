import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from '@/modules/cart/application/services/cart.service';
import { CartController } from '@/modules/cart/presentation/controllers/cart.controller';
import { CartTypeOrmRepository } from '@/modules/cart/infrastructure/persistence/typeorm/cart.typeorm.repository';
import { CartEntity, CartItemsEntity, CartItemIngredientsEntity } from '@/entities';
import { ProductModule } from '@/modules/product/product.module';
import { ProductVariantModule } from '@/modules/product-variant/product-variant.module';
import { IngredientModule } from '@/modules/ingredient/ingredient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemsEntity, CartItemIngredientsEntity]),
    ProductModule,
    ProductVariantModule,
    IngredientModule,
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
