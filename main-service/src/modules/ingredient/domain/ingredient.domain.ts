export class Ingredient {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  sortOrder: number;
  price: number;
  isRequired: boolean | number;
  isActive: boolean | number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Ingredient>) {
    Object.assign(this, partial);
  }
}
