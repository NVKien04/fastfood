import { z } from 'zod';
import { addressSchema } from './utils/address.schema';

export type AddressFormValues = z.infer<typeof addressSchema>;

export interface AddressItem {
  id: string;
  userId?: string;
  street: string;
  city: string;
  district: string;
  ward?: string;
  isDefault?: number;
  createdAt?: string;
  updatedAt?: string;
}
