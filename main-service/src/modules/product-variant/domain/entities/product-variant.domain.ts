import { SizeEnum } from '@/enums/size.enum';
import { TypeEnum } from '@/enums/type.enum';

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
