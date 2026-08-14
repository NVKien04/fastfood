import { Order } from '../entities/order.domain';
import { OrderFilterDto } from '../../presentation/dto/order-filter.dto';
import { PaginationResponse } from '@/common/core/pagination';
import { OrderStatus } from '@/enums/order-status.enum';

export interface IOrderRepository {
  saveOrder(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  findPaginated(filter: OrderFilterDto): Promise<PaginationResponse<Order>>;
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>;
}
