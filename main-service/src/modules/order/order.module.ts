import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '@/entities/orders.entity';
import { OrderItemsEntity } from '@/entities/order-items.entity';
import { OrderItemsIngredientsEntity } from '@/entities/order-item-ingredients.entity';
import { OrderService } from './application/services/order.service';
import { OrderController } from './presentation/controllers/order.controller';
import { OrderTypeOrmRepository } from './infrastructure/repositories/order.typeorm.repository';
import { ProductModule } from '@/modules/product/product.module';
import { ProductVariantModule } from '@/modules/product-variant/product-variant.module';
import { IngredientModule } from '@/modules/ingredient/ingredient.module';
import { CouponModule } from '@/modules/coupon/coupon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity, OrderItemsEntity, OrderItemsIngredientsEntity]),
    ProductModule,
    ProductVariantModule,
    IngredientModule,
    CouponModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'IOrderRepository',
      useClass: OrderTypeOrmRepository,
    },
  ],
  exports: [OrderService, 'IOrderRepository'],
})
export class OrderModule {}
