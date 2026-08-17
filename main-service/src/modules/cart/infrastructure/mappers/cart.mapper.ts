import { CartEntity } from '@/entities';
import { Cart } from '@/modules/cart/domain/entities/cart.domain';

export class CartMapper {
  static toDomain(entity: CartEntity): Cart {
    return {
      id: entity.id,
      userId: entity.userId,
      totalCartPrice: entity.totalCartPrice,
      totalItemDiff: entity.totalItemDiff,
      totalItems: entity.totalItems,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      cartItems: entity.cartItems,
    };
  }

  static toDomainList(entities: CartEntity[]): Cart[] {
    return entities.map((e) => this.toDomain(e));
  }
}
