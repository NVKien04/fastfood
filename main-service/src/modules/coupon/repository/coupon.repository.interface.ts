import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

export interface ICouponRepository {
  findAll(
    condition?: FindOptionsWhere<CouponsEntity>,
    order?: FindOptionsOrder<CouponsEntity>,
    relations?: string[],
  ): Promise<CouponsEntity[]>;
  findOne(condition: FindOptionsWhere<CouponsEntity>, relations?: string[]): Promise<CouponsEntity | null>;
  findById(id: string): Promise<CouponsEntity | null>;
  create(entity: DeepPartial<CouponsEntity>, manager?: EntityManager): Promise<CouponsEntity>;
  update(id: string, entity: DeepPartial<CouponsEntity>, manager?: EntityManager): Promise<CouponsEntity | null>;
  softDelete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<CouponsEntity[]>, manager?: EntityManager): Promise<CouponsEntity[]>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
