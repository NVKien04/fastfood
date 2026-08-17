import { PaginationOptions } from '@/common/core';
import { ProductVariant } from '@/modules/product-variant/domain/entities/product-variant.domain';

export interface IProductVariantRepository {
  findAll(
    condition?: Partial<ProductVariant>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<ProductVariant[]>;
  findOne(condition: Partial<ProductVariant>, relations?: string[]): Promise<ProductVariant | null>;
  findById(id: number): Promise<ProductVariant | null>;
  create(entity: Partial<ProductVariant>, manager?: unknown): Promise<ProductVariant>;
  update(id: number, entity: Partial<ProductVariant>, manager?: unknown): Promise<ProductVariant | null>;
  softDelete(id: number, manager?: unknown): Promise<boolean>;
  delete(id: number, manager?: unknown): Promise<boolean>;
  deleteByProductId(productId: string, manager?: unknown): Promise<boolean>;
  findByProductId(productId: string): Promise<ProductVariant[]>;
  createMany(entity: Partial<ProductVariant>[], manager?: unknown): Promise<ProductVariant[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, unknown>): Promise<[ProductVariant[], number]>;
}
