import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại hoặc email.')
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isPhone = /^(0|\+84)[0-9]{8,10}$/.test(val.replace(/\s+/g, ''));
      return isEmail || isPhone;
    }, 'Email hoặc số điện thoại không đúng định dạng.'),
  password: z.string().min(6, 'Mật khẩu phải có tối thiểu 6 ký tự.'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại hoặc email.')
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isPhone = /^(0|\+84)[0-9]{8,10}$/.test(val.replace(/\s+/g, ''));
      return isEmail || isPhone;
    }, 'Email hoặc số điện thoại không đúng định dạng.'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự.')
    .regex(/(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải có ít nhất 1 chữ hoa và 1 số.'),
});
