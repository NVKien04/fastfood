export class Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  value: number;
  minOrderAmount: number;
  maxUser: number;
  currentUses: number;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean | number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<Coupon>) {
    Object.assign(this, partial);
  }
}
