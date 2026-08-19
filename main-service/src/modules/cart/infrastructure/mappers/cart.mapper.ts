import { CartEntity } from '@/entities';
import { Cart, CartItem, CartItemIngredient } from '@/modules/cart/domain/entities/cart.domain';

export class CartMapper {
  static toCartItemIngredientDomain(
    entity: CartEntity['cartItems'][number]['cartItemIngredients'][number],
  ): CartItemIngredient {
    return {
      id: entity.id,
      cartItemId: entity.cartItemId,
      ingredientId: entity.ingredientId,
      quantity: entity.quantity,
      ingredientName: entity.ingredient_obj?.name,
      ingredientPrice: entity.ingredient_obj?.price,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  static toCartItemDomain(entity: CartEntity['cartItems'][number]): CartItem {
    return {
      id: entity.id,
      productId: entity.productId,
      productVariantId: entity.productVariantId,
      comboId: entity.comboId,
      cartId: entity.cartId,
      quantity: entity.quantity,
      price: entity.price,
      options: entity.options,
      productName: entity.product_obj?.name,
      productImage: entity.product_obj?.img,
      variantName: entity.productVariant_obj?.name,
      cartItemIngredients: entity.cartItemIngredients?.map((ingredient) =>
        CartMapper.toCartItemIngredientDomain(ingredient),
      ),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

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
      cartItems: entity.cartItems?.map((item) => CartMapper.toCartItemDomain(item)),
    };
  }

  static toDomainList(entities: CartEntity[]): Cart[] {
    return entities.map((e) => this.toDomain(e));
  }
}
