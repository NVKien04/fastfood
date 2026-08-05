import { PaginationOptions } from '#src/common/core/pagination';
import { Coupon } from './coupon.domain';

export interface ICouponRepository {
  findAll(condition?: Partial<Coupon>, order?: Record<string, 'ASC' | 'DESC'>, relations?: string[]): Promise<Coupon[]>;
  findOne(condition: Partial<Coupon>, relations?: string[]): Promise<Coupon | null>;
  findById(id: string): Promise<Coupon | null>;
  create(entity: Partial<Coupon>): Promise<Coupon>;
  update(id: string, entity: Partial<Coupon>): Promise<Coupon | null>;
  softDelete(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  createMany(entities: Partial<Coupon>[]): Promise<Coupon[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Coupon[], number]>;
}
