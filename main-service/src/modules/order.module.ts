import { OrderItemsIngredientsEntity } from '#src/entities/order-item-ingredients.entity';
import { OrderItemsEntity } from '#src/entities/order-items.entity';
import { OrdersEntity } from '#src/entities/orders.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, OrderItemsEntity, OrderItemsIngredientsEntity])],
})
export class OrderModule {}
