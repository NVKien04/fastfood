import { OrderItemsIngredientsEntity } from '@/entities/order-item-ingredients.entity';
import { OrderItemsEntity } from '@/entities/order-items.entity';
import { OrdersEntity } from '@/entities/orders.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, OrderItemsEntity, OrderItemsIngredientsEntity])],
})
export class OrderModule {}
