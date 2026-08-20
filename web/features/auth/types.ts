import { z } from 'zod';
import { loginSchema, registerSchema } from './utils/auth.schema';

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export type AuthStep = 1 | 2 | 3;
