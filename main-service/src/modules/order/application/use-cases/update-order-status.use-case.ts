import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@/enums';
import { OrderService } from '@/modules/order/application/services/order.service';
import { Order } from '@/modules/order/domain/entities/order.domain';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(private readonly orderService: OrderService) {}

  execute(id: string, status: OrderStatus): Promise<Order> {
    return this.orderService.updateOrderStatus(id, status);
  }
}
