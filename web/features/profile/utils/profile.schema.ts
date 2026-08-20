import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự.').max(50, 'Họ và tên tối đa 50 ký tự.'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(0|\+84)[0-9]{8,10}$/.test(val.replace(/\s+/g, '')),
      'Số điện thoại không hợp lệ.',
    ),
});
