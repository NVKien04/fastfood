import { OrderStatus } from '@/enums/order-status.enum';
import { PaymentMethod } from '@/enums/payment-method.enum';
import { PaymentStatus } from '@/enums/payment-status.enum';
import { OrderItemsEntity } from '@/entities/order-items.entity';

export interface Order {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  orderItems?: OrderItemsEntity[];
}
