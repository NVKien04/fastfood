import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ProductEntity } from '#src/entities/product.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

export interface IProductRepository {
  findAll(
    condition?: FindOptionsWhere<ProductEntity>,
    order?: FindOptionsOrder<ProductEntity>,
    relations?: string[],
  ): Promise<ProductEntity[]>;
  findOne(condition: FindOptionsWhere<ProductEntity>, relations?: string[]): Promise<ProductEntity | null>;
  findById(id: string): Promise<ProductEntity | null>;
  create(entity: DeepPartial<ProductEntity>, manager?: EntityManager): Promise<ProductEntity>;
  update(id: string, entity: DeepPartial<ProductEntity>, manager?: EntityManager): Promise<ProductEntity | null>;
  softDelete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<ProductEntity[]>, manager?: EntityManager): Promise<ProductEntity[]>;
  GetPage(filterObj: filterObj): Promise<PaginationResponse<any>>;
}
