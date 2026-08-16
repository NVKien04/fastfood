import { PaginationOptions } from '@/common/core/pagination';
import { Product } from '@/modules/product/domain/entities/product.domain';

export interface ProductFilterOptions extends PaginationOptions {
  search?: string;
  categoryId?: number;
  isFeatured?: number;
  isActive?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface IProductRepository {
  findAll(
    condition?: Partial<Product>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Product[]>;
  findOne(condition: Partial<Product>, relations?: string[]): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  create(entity: Partial<Product>, manager?: unknown): Promise<Product>;
  update(id: string, entity: Partial<Product>, manager?: unknown): Promise<Product | null>;
  softDelete(id: string, manager?: unknown): Promise<boolean>;
  delete(id: string, manager?: unknown): Promise<boolean>;
  createMany(entities: Partial<Product>[], manager?: unknown): Promise<Product[]>;
  findPaginated(options: ProductFilterOptions): Promise<[Product[], number]>;
  executeTransaction<T>(callback: (manager: unknown) => Promise<T>): Promise<T>;
}
