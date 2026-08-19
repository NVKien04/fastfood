export interface CartItemIngredient {
  id: string;
  cartItemId: string;
  ingredientId: number;
  quantity: number;
  ingredientName?: string;
  ingredientPrice?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CartItem {
  id: string;
  productId?: string | null;
  productVariantId?: number | null;
  comboId?: string | null;
  cartId: string;
  quantity: number;
  price?: number | null;
  options?: Record<string, unknown> | null;
  productName?: string;
  productImage?: string;
  variantName?: string;
  cartItemIngredients?: CartItemIngredient[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Cart {
  id: string;
  userId: string;
  totalCartPrice: number;
  totalItemDiff: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  cartItems?: CartItem[];
}
