import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ProductVariantsEntity } from '#src/entities/product_variants.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

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
  softDelete(id: number, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: number, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<ProductVariantsEntity[]>, manager?: EntityManager): Promise<ProductVariantsEntity[]>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
