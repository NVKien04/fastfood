export class Address {
  id: string;
  street: string;
  city: string;
  district: string;
  ward: string;
  longitude: number;
  latitude: number;
  isDefault: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Address>) {
    Object.assign(this, partial);
  }
}
