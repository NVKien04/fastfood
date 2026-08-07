export class Review {
  id: number;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Review>) {
    Object.assign(this, partial);
  }
}
