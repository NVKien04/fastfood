import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '@/entities/orders.entity';
import { OrderItemsEntity } from '@/entities/order-items.entity';
import { OrderItemsIngredientsEntity } from '@/entities/order-item-ingredients.entity';
import { ProductEntity } from '@/entities/product.entity';
import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { IngredientsEntity } from '@/entities/ingredients.entity';
import { OrderService } from './application/services/order.service';
import { OrderController } from './presentation/controllers/order.controller';
import { OrderTypeOrmRepository } from './infrastructure/repositories/order.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersEntity,
      OrderItemsEntity,
      OrderItemsIngredientsEntity,
      ProductEntity,
      ProductVariantsEntity,
      IngredientsEntity,
    ]),
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
