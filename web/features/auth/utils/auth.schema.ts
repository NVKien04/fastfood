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

export const registerSchema = z
  .object({
    phone: z
      .string()
      .min(1, 'Vui lòng nhập số điện thoại.')
      .regex(/^(0|\+84)[0-9]{8,10}$/, 'Số điện thoại không hợp lệ (gồm 9-11 chữ số).'),
    email: z
      .string()
      .min(1, 'Vui lòng nhập địa chỉ email.')
      .email('Email không đúng định dạng.'),
    name: z
      .string()
      .min(2, 'Họ và tên tối thiểu 2 ký tự.')
      .max(50, 'Họ và tên tối đa 50 ký tự.'),
    password: z
      .string()
      .min(8, 'Mật khẩu tối thiểu 8 ký tự.')
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số.'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận lại mật khẩu.'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'Bạn cần đồng ý với điều khoản sử dụng.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không trùng khớp.',
    path: ['confirmPassword'],
  });
