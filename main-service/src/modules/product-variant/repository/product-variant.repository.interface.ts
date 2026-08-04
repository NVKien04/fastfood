import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ProductVariantsEntity } from '#src/entities/product_variants.entity';
import { PaginationOptions } from '#src/common/core/pagination';

export interface IProductVariantRepository {
  findAll(
    condition?: FindOptionsWhere<ProductVariantsEntity>,
    order?: FindOptionsOrder<ProductVariantsEntity>,
    relations?: string[],
  ): Promise<ProductVariantsEntity[]>;
  findOne(
    condition: FindOptionsWhere<ProductVariantsEntity>,
    relations?: string[],
  ): Promise<ProductVariantsEntity | null>;
  findById(id: number): Promise<ProductVariantsEntity | null>;
  create(entity: DeepPartial<ProductVariantsEntity>, manager?: EntityManager): Promise<ProductVariantsEntity>;
  update(
    id: number,
    entity: DeepPartial<ProductVariantsEntity>,
    manager?: EntityManager,
  ): Promise<ProductVariantsEntity | null>;
  softDelete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  createMany(entity: DeepPartial<ProductVariantsEntity>[], manager?: EntityManager): Promise<ProductVariantsEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[ProductVariantsEntity[], number]>;
}
