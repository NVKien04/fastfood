import { Cart } from '../entities/cart.domain';

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  findById(id: string): Promise<Cart | null>;
  createCart(userId: string): Promise<Cart>;
  updateCartTotals(cartId: string, totalCartPrice: number, totalItemDiff: number, totalItems: number): Promise<void>;
  clearCartItems(cartId: string): Promise<void>;
}
