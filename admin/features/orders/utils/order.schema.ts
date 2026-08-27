import { z } from 'zod';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';

export const cancelOrderSchema = z.object({
  reason: z.string().min(1, 'ORDERS.CANCEL_REASON_REQUIRED').max(500, 'Lý do tối đa 500 ký tự'),
});

export type CancelOrderFormValues = z.infer<typeof cancelOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type UpdateOrderStatusFormValues = z.infer<typeof updateOrderStatusSchema>;
