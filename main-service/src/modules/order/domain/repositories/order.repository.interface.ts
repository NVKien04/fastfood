import { Order } from '@/modules/order/domain/entities/order.domain';
import { type OrderFilterDto } from '@/modules/order/presentation/dto';
import { type PaginationResponse } from '@/common/core';
import { type OrderStatus } from '@/enums';

export interface IOrderRepository {
  saveOrder(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findPaginated(filter: OrderFilterDto): Promise<PaginationResponse<Order>>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
  cancelOrder(id: string, reason?: string): Promise<Order | null>;
}
