import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { CartEntity, CartItemIngredientsEntity, CartItemsEntity } from '@/entities';
import { Cart, CartItem } from '@/modules/cart/domain/entities/cart.domain';
import { CreateCartItemInput, ICartRepository } from '@/modules/cart/domain/repositories/cart.repository.interface';
import { CartMapper } from '@/modules/cart/infrastructure/mappers/cart.mapper';

@Injectable()
export class CartTypeOrmRepository implements ICartRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItemsEntity)
    private readonly cartItemRepo: Repository<CartItemsEntity>,
    @InjectRepository(CartItemIngredientsEntity)
    private readonly cartItemIngRepo: Repository<CartItemIngredientsEntity>,
  ) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    const entity = await this.cartRepo.findOne({
      where: { userId },
      relations: [
        'cartItems',
        'cartItems.product_obj',
        'cartItems.productVariant_obj',
        'cartItems.cartItemIngredients',
        'cartItems.cartItemIngredients.ingredient_obj',
      ],
    });
    return entity ? CartMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<Cart | null> {
    const entity = await this.cartRepo.findOne({
      where: { id },
      relations: [
        'cartItems',
        'cartItems.product_obj',
        'cartItems.productVariant_obj',
        'cartItems.cartItemIngredients',
        'cartItems.cartItemIngredients.ingredient_obj',
      ],
    });
    return entity ? CartMapper.toDomain(entity) : null;
  }

  async createCart(userId: string): Promise<Cart> {
    const newCart = this.cartRepo.create({
      userId,
      totalCartPrice: 0,
      totalItemDiff: 0,
      totalItems: 0,
    });
    const saved = await this.cartRepo.save(newCart);
    saved.cartItems = [];
    return CartMapper.toDomain(saved);
  }

  async findItemById(cartId: string, cartItemId: string): Promise<CartItem | null> {
    const entity = await this.cartItemRepo.findOne({
      where: { id: cartItemId, cartId },
      relations: ['cartItemIngredients', 'cartItemIngredients.ingredient_obj', 'product_obj', 'productVariant_obj'],
    });
    return entity ? CartMapper.toCartItemDomain(entity) : null;
  }

  async addItem(cartId: string, item: CreateCartItemInput): Promise<void> {
    const existingItem = await this.findMatchingItem(cartId, item);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.price = item.price;
      await this.cartItemRepo.save(existingItem);
      return;
    }

    const newItem = this.cartItemRepo.create({
      cartId,
      productId: item.productId,
      productVariantId: item.productVariantId ?? null,
      quantity: item.quantity,
      price: item.price,
    });
    const savedItem = await this.cartItemRepo.save(newItem);

    for (const ingredient of item.ingredients ?? []) {
      const cartIngredient = this.cartItemIngRepo.create({
        cartItemId: savedItem.id,
        ingredientId: ingredient.ingredientId,
        quantity: ingredient.quantity,
      });
      await this.cartItemIngRepo.save(cartIngredient);
    }
  }

  async updateItemQuantity(cartItemId: string, quantity: number): Promise<void> {
    await this.cartItemRepo.update(cartItemId, { quantity });
  }

  async removeItem(cartItemId: string): Promise<void> {
    await this.cartItemIngRepo.delete({ cartItemId });
    await this.cartItemRepo.delete({ id: cartItemId });
  }

  async findItemsByCartId(cartId: string): Promise<CartItem[]> {
    const entities = await this.cartItemRepo.find({ where: { cartId } });
    return entities.map((entity) => CartMapper.toCartItemDomain(entity));
  }

  async updateCartTotals(
    cartId: string,
    totalCartPrice: number,
    totalItemDiff: number,
    totalItems: number,
  ): Promise<void> {
    await this.cartRepo.update(cartId, {
      totalCartPrice,
      totalItemDiff,
      totalItems,
    });
  }

  async clearCartItems(cartId: string): Promise<void> {
    const cartItems = await this.cartItemRepo.find({ where: { cartId } });
    for (const item of cartItems) {
      await this.cartItemIngRepo.delete({ cartItemId: item.id });
    }
    await this.cartItemRepo.delete({ cartId });
    await this.updateCartTotals(cartId, 0, 0, 0);
  }

  private async findMatchingItem(cartId: string, item: CreateCartItemInput): Promise<CartItemsEntity | null> {
    const where: FindOptionsWhere<CartItemsEntity> = {
      cartId,
      productId: item.productId,
      productVariantId: item.productVariantId ?? IsNull(),
    };

    const cartItems = await this.cartItemRepo.find({
      where,
      relations: ['cartItemIngredients'],
    });

    const targetIngredientIds = (item.ingredients ?? [])
      .map((ingredient) => ingredient.ingredientId)
      .sort((a, b) => a - b);

    return (
      cartItems.find((cartItem) => {
        const cartItemIngredientIds = (cartItem.cartItemIngredients ?? [])
          .map((ingredient) => ingredient.ingredientId)
          .sort((a, b) => a - b);

        return (
          targetIngredientIds.length === cartItemIngredientIds.length &&
          targetIngredientIds.every((id, index) => id === cartItemIngredientIds[index])
        );
      }) ?? null
    );
  }
}
