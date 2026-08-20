import { z } from 'zod';
import { checkoutSchema } from './utils/checkout.schema';
import { OrderResponseDto } from '@/services/apis/main/module/Order.api';

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export type { OrderResponseDto };
