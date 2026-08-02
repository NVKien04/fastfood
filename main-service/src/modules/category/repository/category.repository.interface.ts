import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CategoryEntity } from '#src/entities/category.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

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
  softDelete(id: number, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: number, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<CategoryEntity[]>, manager?: EntityManager): Promise<CategoryEntity[]>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
