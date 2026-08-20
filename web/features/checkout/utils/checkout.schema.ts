import { z } from 'zod';
import { PaymentMethodEnum } from '@/constants';

export const checkoutSchema = z.object({
  guestName: z.string().min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự).'),
  guestPhone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại.')
    .regex(/^(0|\+84)[0-9]{8,10}$/, 'Số điện thoại không hợp lệ (gồm 9-11 chữ số).'),
  guestAddress: z.string().min(5, 'Vui lòng nhập địa chỉ giao hàng chi tiết.'),
  notes: z.string().optional(),
  paymentMethod: z.enum([PaymentMethodEnum.COD, PaymentMethodEnum.VNPAY]),
});
