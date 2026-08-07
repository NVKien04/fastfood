export class Combo {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  img: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Combo>) {
    Object.assign(this, partial);
  }
}
