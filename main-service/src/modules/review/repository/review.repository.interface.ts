import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ReviewEntity } from '#src/entities/reviews.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

export interface IReviewRepository {
  findAll(
    condition?: FindOptionsWhere<ReviewEntity>,
    order?: FindOptionsOrder<ReviewEntity>,
    relations?: string[],
  ): Promise<ReviewEntity[]>;
  findOne(condition: FindOptionsWhere<ReviewEntity>, relations?: string[]): Promise<ReviewEntity | null>;
  findById(id: number): Promise<ReviewEntity | null>;
  create(entity: DeepPartial<ReviewEntity>, manager?: EntityManager): Promise<ReviewEntity>;
  update(id: number, entity: DeepPartial<ReviewEntity>, manager?: EntityManager): Promise<ReviewEntity | null>;
  softDelete(id: number, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: number, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<ReviewEntity[]>, manager?: EntityManager): Promise<ReviewEntity[]>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
