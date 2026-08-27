import { z } from 'zod';

export const addressSchema = z.object({
  city: z.string().min(2, 'Vui lòng nhập Tỉnh / Thành phố.'),
  district: z.string().min(2, 'Vui lòng nhập Quận / Huyện.'),
  ward: z.string().optional(),
  street: z.string().min(3, 'Vui lòng nhập số nhà, tên đường chi tiết.'),
  isDefault: z.boolean().optional(),
});
