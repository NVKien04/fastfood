import { Cart, CartItem } from '@/modules/cart/domain/entities/cart.domain';

export interface CreateCartItemInput {
  productId: string;
  productVariantId?: number | null;
  quantity: number;
  price: number;
  ingredients?: {
    ingredientId: number;
    quantity: number;
  }[];
}

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  findById(id: string): Promise<Cart | null>;
  createCart(userId: string): Promise<Cart>;
  findItemById(cartId: string, cartItemId: string): Promise<CartItem | null>;
  addItem(cartId: string, item: CreateCartItemInput): Promise<void>;
  updateItemQuantity(cartItemId: string, quantity: number): Promise<void>;
  removeItem(cartItemId: string): Promise<void>;
  findItemsByCartId(cartId: string): Promise<CartItem[]>;
  updateCartTotals(cartId: string, totalCartPrice: number, totalItemDiff: number, totalItems: number): Promise<void>;
  clearCartItems(cartId: string): Promise<void>;
}
