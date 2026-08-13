import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '@/entities/cart.entity';
import { CartItemsEntity } from '@/entities/cart-items.entity';
import { CartItemIngredientsEntity } from '@/entities/cart-item-ingredient.entity';
import { Cart } from '../../domain/entities/cart.domain';
import { ICartRepository } from '../../domain/repositories/cart.repository.interface';
import { CartMapper } from '../mappers/cart.mapper';

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
}
