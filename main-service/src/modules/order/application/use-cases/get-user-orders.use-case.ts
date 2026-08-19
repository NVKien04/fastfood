import { Injectable } from '@nestjs/common';
import { OrderService } from '@/modules/order/application/services/order.service';
import { Order } from '@/modules/order/domain/entities/order.domain';

@Injectable()
export class GetUserOrdersUseCase {
  constructor(private readonly orderService: OrderService) {}

  execute(userId: string): Promise<Order[]> {
    return this.orderService.getUserOrders(userId);
  }
}
