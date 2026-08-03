import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { PaginationOptions } from '#src/common/core/paganation';

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
  softDelete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  createMany(entity: DeepPartial<CouponsEntity>[], manager?: EntityManager): Promise<CouponsEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[CouponsEntity[], number]>;
}
