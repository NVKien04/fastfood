import { PaginationOptions } from '#src/common/core/pagination';
import { Product } from '../entities/product.domain';

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
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Product[], number]>;
  executeTransaction<T>(callback: (manager: unknown) => Promise<T>): Promise<T>;
}
