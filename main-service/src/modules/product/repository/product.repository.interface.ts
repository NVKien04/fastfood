import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ProductEntity } from '#src/entities/product.entity';
import { PaginationOptions } from '#src/common/core/paganation';

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
  softDelete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  createMany(entity: DeepPartial<ProductEntity>[], manager?: EntityManager): Promise<ProductEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[ProductEntity[], number]>;
}
