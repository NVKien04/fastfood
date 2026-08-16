export class ProductIngredient {
  id: string;
  productId: string;
  ingredientId: number;
  isDefault: number;
  quantity?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<ProductIngredient>) {
    Object.assign(this, partial);
  }
}
