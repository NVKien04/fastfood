import { Injectable } from '@nestjs/common';
import { OrderService } from '@/modules/order/application/services/order.service';
import { Order } from '@/modules/order/domain/entities/order.domain';
import { CreateOrderDto } from '@/modules/order/presentation/dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly orderService: OrderService) {}

  execute(dto: CreateOrderDto, userId?: string): Promise<Order> {
    return this.orderService.createOrder(dto, userId);
  }
}
