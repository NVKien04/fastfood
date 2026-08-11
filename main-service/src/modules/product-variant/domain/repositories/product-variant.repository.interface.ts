import { DeepPartial, DeleteResult, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
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
  create(entity: DeepPartial<ProductVariantsEntity>, manager?: unknown): Promise<ProductVariantsEntity>;
  update(
    id: number,
    entity: DeepPartial<ProductVariantsEntity>,
    manager?: unknown,
  ): Promise<ProductVariantsEntity | null>;
  softDelete(id: number, manager?: unknown): Promise<DeleteResult>;
  delete(id: number, manager?: unknown): Promise<DeleteResult>;
  deleteByProductId(productId: string, manager?: unknown): Promise<DeleteResult>;
  createMany(entity: DeepPartial<ProductVariantsEntity>[], manager?: unknown): Promise<ProductVariantsEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[ProductVariantsEntity[], number]>;
}
