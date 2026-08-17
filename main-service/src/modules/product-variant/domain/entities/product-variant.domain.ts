import { SizeEnum, TypeEnum } from '@/enums';

export class ProductVariant {
  id: number;
  name: string;
  size: SizeEnum;
  type: TypeEnum;
  modifiedPrice: number;
  isActive: number;
  sortOrder: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<ProductVariant>) {
    Object.assign(this, partial);
  }
}
