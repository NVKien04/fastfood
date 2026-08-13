import { CartItemsEntity } from '@/entities/cart-items.entity';

export interface Cart {
  id: string;
  userId: string;
  totalCartPrice: number;
  totalItemDiff: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  cartItems?: CartItemsEntity[];
}
