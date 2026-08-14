import { OrdersEntity } from '@/entities/orders.entity';
import { OrderItemsEntity } from '@/entities/order-items.entity';
import { OrderItemsIngredientsEntity } from '@/entities/order-item-ingredients.entity';
import { Order, OrderItem, OrderItemIngredient } from '../../domain/entities/order.domain';

export class OrderMapper {
  static toDomainIngredient(entity: OrderItemsIngredientsEntity): OrderItemIngredient {
    return {
      id: entity.id,
      orderItemId: entity.orderItemId,
      ingredientId: entity.ingredientId,
      quantity: entity.quantity,
      ingredientName: entity.ingredient_obj?.name,
      ingredientPrice: entity.ingredient_obj?.price,
    };
  }

  static toDomainItem(entity: OrderItemsEntity): OrderItem {
    return {
      id: entity.id,
      orderId: entity.orderId,
      productId: entity.productId,
      productVariantId: entity.productVariantId,
      quantity: entity.quantity,
      price: entity.price,
      productName: entity.product_obj?.name,
      variantName: entity.productVariant_obj?.name,
      ingredients: entity.orderItemIngredients
        ? entity.orderItemIngredients.map((ing) => this.toDomainIngredient(ing))
        : [],
    };
  }

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
      orderItems: entity.orderItems ? entity.orderItems.map((item) => this.toDomainItem(item)) : [],
    };
  }

  static toDomainList(entities: OrdersEntity[]): Order[] {
    return entities.map((e) => this.toDomain(e));
  }
}
