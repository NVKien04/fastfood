import { OrdersEntity } from '@/entities/orders.entity';
import { Order } from '../../domain/entities/order.domain';

export class OrderMapper {
  static toDomain(entity: OrdersEntity): Order {
    return {
      id: entity.id,
      orderNumber: entity.orderNumber,
      status: entity.status,
      paymentStatus: entity.paymentStatus,
      paymentMethod: entity.paymentMethod,
      subTotal: entity.subTotal,
      deliveryFee: entity.deliveryFee,
      discount: entity.discount,
      total: entity.total,
      notes: entity.notes,
      userId: entity.userId,
      addressId: entity.addressId,
      guestName: entity.guestName,
      guestPhone: entity.guestPhone,
      guestAddress: entity.guestAddress,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      orderItems: entity.orderItems,
    };
  }

  static toDomainList(entities: OrdersEntity[]): Order[] {
    return entities.map((e) => this.toDomain(e));
  }
}
