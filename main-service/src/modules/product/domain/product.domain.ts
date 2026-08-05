export class Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  sortOrder: number;
  img: string;
  isFeatured: number;
  categoryId: number;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
