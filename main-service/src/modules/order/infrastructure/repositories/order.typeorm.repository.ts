import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersEntity } from '@/entities/orders.entity';
import { Order } from '../../domain/entities/order.domain';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderFilterDto } from '../../presentation/dto/order-filter.dto';
import { OrderStatus } from '@/enums/order-status.enum';
import { PaymentStatus } from '@/enums/payment-status.enum';
import { buildPaginationResponse, PaginationResponse } from '@/common/core/pagination';

@Injectable()
export class OrderTypeOrmRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepo: Repository<OrdersEntity>,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const entity = await this.orderRepo.findOne({
      where: { id },
      relations: [
        'orderItems',
        'orderItems.product_obj',
        'orderItems.productVariant_obj',
        'orderItems.orderItemIngredients',
        'orderItems.orderItemIngredients.ingredient_obj',
        'user_obj',
        'address_obj',
      ],
    });
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const entities = await this.orderRepo.find({
      where: { userId },
      relations: [
        'orderItems',
        'orderItems.product_obj',
        'orderItems.productVariant_obj',
        'orderItems.orderItemIngredients',
        'orderItems.orderItemIngredients.ingredient_obj',
      ],
      order: { createdAt: 'DESC' },
    });
    return OrderMapper.toDomainList(entities);
  }

  async findPaginated(filter: OrderFilterDto): Promise<PaginationResponse<Order>> {
    const page = Math.max(1, Number(filter.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filter.limit ?? 10)));
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product_obj', 'product')
      .leftJoinAndSelect('order.user_obj', 'user');

    if (filter.status) {
      queryBuilder.andWhere('order.status = :status', { status: filter.status });
    }

    if (filter.userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId: filter.userId });
    }

    queryBuilder.orderBy('order.createdAt', 'DESC').skip(skip).take(limit);

    const [entities, totalItems] = await queryBuilder.getManyAndCount();
    const domainList = OrderMapper.toDomainList(entities);
    return buildPaginationResponse(domainList, totalItems, page, limit);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const entity = await this.orderRepo.findOne({ where: { id } });
    if (!entity) return null;

    entity.status = status;
    if (status === OrderStatus.DELIVERED) {
      entity.paymentStatus = PaymentStatus.PAID;
    }
    const saved = await this.orderRepo.save(entity);
    return OrderMapper.toDomain(saved);
  }
}
