import { OrderStatus } from '@/enums/order-status.enum';
import { PaymentMethod } from '@/enums/payment-method.enum';
import { PaymentStatus } from '@/enums/payment-status.enum';

export interface OrderItemIngredient {
  id?: string;
  orderItemId?: string;
  ingredientId: number;
  quantity: number;
  ingredientName?: string;
  ingredientPrice?: number;
}

export interface OrderItem {
  id?: string;
  orderId?: string;
  productId?: string | null;
  productVariantId?: number | null;
  comboId?: string | null;
  quantity: number;
  price?: number | null;
  productName?: string;
  variantName?: string;
  ingredients?: OrderItemIngredient[];
}

export interface Order {
  id?: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string | null;
  userId?: string | null;
  addressId?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  guestAddress?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  orderItems?: OrderItem[];
}
