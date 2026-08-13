import { Product } from '@/modules/product/domain/entities/product.domain';

export class Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  products?: Product[];

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
