import { PaginationOptions } from '@/common/core';
import { Coupon } from '@/modules/coupon/domain/entities/coupon.domain';

export interface ICouponRepository {
  findAll(condition?: Partial<Coupon>, order?: Record<string, 'ASC' | 'DESC'>, relations?: string[]): Promise<Coupon[]>;
  findOne(condition: Partial<Coupon>, relations?: string[]): Promise<Coupon | null>;
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  incrementUsage(id: string): Promise<boolean>;
  create(entity: Partial<Coupon>): Promise<Coupon>;
  update(id: string, entity: Partial<Coupon>): Promise<Coupon | null>;
  softDelete(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  createMany(entities: Partial<Coupon>[]): Promise<Coupon[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, unknown>): Promise<[Coupon[], number]>;
}
