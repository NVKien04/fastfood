import { Injectable } from '@nestjs/common';
import { type PaginationResponse } from '@/common/core';
import { OrderService } from '@/modules/order/application/services/order.service';
import { Order } from '@/modules/order/domain/entities/order.domain';
import { OrderFilterDto } from '@/modules/order/presentation/dto';

@Injectable()
export class GetOrdersPageUseCase {
  constructor(private readonly orderService: OrderService) {}

  execute(filter: OrderFilterDto): Promise<PaginationResponse<Order>> {
    return this.orderService.getOrdersPage(filter);
  }
}
