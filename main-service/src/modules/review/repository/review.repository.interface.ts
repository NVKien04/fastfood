import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ReviewEntity } from '#src/entities/reviews.entity';
import { PaginationOptions } from '#src/common/core/pagination';

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
  softDelete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  createMany(entity: DeepPartial<ReviewEntity>[], manager?: EntityManager): Promise<ReviewEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[ReviewEntity[], number]>;
}
