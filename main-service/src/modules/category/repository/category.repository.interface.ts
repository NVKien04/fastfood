import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CategoryEntity } from '#src/entities/category.entity';
import { PaginationOptions } from '#src/common/core/paganation';

export interface ICategoryRepository {
  findAll(
    condition?: FindOptionsWhere<CategoryEntity>,
    order?: FindOptionsOrder<CategoryEntity>,
    relations?: string[],
  ): Promise<CategoryEntity[]>;
  findOne(condition: FindOptionsWhere<CategoryEntity>, relations?: string[]): Promise<CategoryEntity | null>;
  findById(id: number): Promise<CategoryEntity | null>;
  create(entity: DeepPartial<CategoryEntity>, manager?: EntityManager): Promise<CategoryEntity>;
  update(id: number, entity: DeepPartial<CategoryEntity>, manager?: EntityManager): Promise<CategoryEntity | null>;
  softDelete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  createMany(entity: DeepPartial<CategoryEntity>[], manager?: EntityManager): Promise<CategoryEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[CategoryEntity[], number]>;
}
