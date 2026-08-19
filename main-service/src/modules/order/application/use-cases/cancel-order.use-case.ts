import { Injectable } from '@nestjs/common';
import { type AuthUser } from '@/modules/auth/domain/interface/auth.interface';
import { OrderService } from '@/modules/order/application/services/order.service';
import { Order } from '@/modules/order/domain/entities/order.domain';

@Injectable()
export class CancelOrderUseCase {
  constructor(private readonly orderService: OrderService) {}

  execute(id: string, reason: string | undefined, currentUser: AuthUser): Promise<Order> {
    return this.orderService.cancelOrder(id, reason, currentUser);
  }
}
