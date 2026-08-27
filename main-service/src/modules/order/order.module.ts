import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsEntity, OrderItemsIngredientsEntity, OrdersEntity } from '@/entities';
import { OrderService } from '@/modules/order/application/services/order.service';
import { OrderController } from '@/modules/order/presentation/controllers/order.controller';
import { OrderTypeOrmRepository } from '@/modules/order/infrastructure/persistence/typeorm/order.typeorm.repository';
import { ProductModule } from '@/modules/product/product.module';
import { ProductVariantModule } from '@/modules/product-variant/product-variant.module';
import { IngredientModule } from '@/modules/ingredient/ingredient.module';
import { CouponModule } from '@/modules/coupon/coupon.module';
import { NotificationModule } from '@/modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity, OrderItemsEntity, OrderItemsIngredientsEntity]),
    ProductModule,
    ProductVariantModule,
    IngredientModule,
    CouponModule,
    NotificationModule,
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
