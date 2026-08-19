import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderItemsEntity, OrderItemsIngredientsEntity, OrdersEntity } from '@/entities';
import { Order } from '@/modules/order/domain/entities/order.domain';
import { IOrderRepository } from '@/modules/order/domain/repositories/order.repository.interface';
import { OrderMapper } from '@/modules/order/infrastructure/mappers/order.mapper';
import { type OrderFilterDto } from '@/modules/order/presentation/dto';
import { OrderStatus, PaymentStatus } from '@/enums';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';
import { buildPaginationResponse, type PaginationResponse } from '@/common/core';

@Injectable()
export class OrderTypeOrmRepository implements IOrderRepository {
  private readonly logger = new Logger(OrderTypeOrmRepository.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OrdersEntity)
    private readonly orderRepo: Repository<OrdersEntity>,
  ) {}

  /**
   * Lưu toàn bộ Aggregate Root của Order (Order, OrderItems, OrderItemIngredients) vào Database
   */
  async saveOrder(order: Order): Promise<Order> {
    const savedOrderId = await this.dataSource.transaction(async (manager) => {
      const orderEntity = manager.getRepository(OrdersEntity).create({
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod ?? undefined,
        subTotal: order.subTotal,
        deliveryFee: order.deliveryFee,
        discount: order.discount,
        total: order.total,
        notes: order.notes ?? undefined,
        userId: order.userId ?? undefined,
        addressId: order.addressId ?? undefined,
        guestName: order.guestName ?? undefined,
        guestPhone: order.guestPhone ?? undefined,
        guestAddress: order.guestAddress ?? undefined,
      });

      const savedOrder = await manager.save(OrdersEntity, orderEntity);

      if (order.orderItems && order.orderItems.length > 0) {
        for (const item of order.orderItems) {
          const orderItem = manager.getRepository(OrderItemsEntity).create({
            orderId: savedOrder.id,
            productId: item.productId ?? undefined,
            productVariantId: item.productVariantId ?? undefined,
            comboId: item.comboId ?? undefined,
            quantity: item.quantity,
            price: item.price ?? 0,
          });

          const savedOrderItem = await manager.save(OrderItemsEntity, orderItem);

          if (item.ingredients && item.ingredients.length > 0) {
            for (const ing of item.ingredients) {
              const itemIng = manager.getRepository(OrderItemsIngredientsEntity).create({
                orderItemId: savedOrderItem.id,
                ingredientId: ing.ingredientId,
                quantity: ing.quantity,
              });
              await manager.save(OrderItemsIngredientsEntity, itemIng);
            }
          }
        }
      }

      this.logger.log(`✅ Saved Order #${savedOrder.orderNumber} successfully!`);
      return savedOrder.id;
    });

    const fullOrder = await this.findById(savedOrderId);
    if (!fullOrder) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }
    return fullOrder;
  }

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
    if (status === OrderStatus.CANCELLED) {
      entity.paymentStatus = PaymentStatus.CANCELLED;
    }
    const saved = await this.orderRepo.save(entity);
    return OrderMapper.toDomain(saved);
  }

  async cancelOrder(id: string, reason?: string): Promise<Order | null> {
    const entity = await this.orderRepo.findOne({ where: { id } });
    if (!entity) return null;

    entity.status = OrderStatus.CANCELLED;
    entity.paymentStatus = PaymentStatus.CANCELLED;
    if (reason) {
      entity.notes = entity.notes ? `${entity.notes}\n[Lý do hủy]: ${reason}` : `[Lý do hủy]: ${reason}`;
    }
    const saved = await this.orderRepo.save(entity);
    return OrderMapper.toDomain(saved);
  }
}
