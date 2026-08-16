import { PaginationOptions } from '@/common/core/pagination';
import { ProductIngredient } from '@/modules/product-ingredient/domain/entities/product-ingredient.domain';

export interface IProductIngredientRepository {
  findAll(
    condition?: Partial<ProductIngredient>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<ProductIngredient[]>;
  findOne(condition: Partial<ProductIngredient>, relations?: string[]): Promise<ProductIngredient | null>;
  findById(id: string): Promise<ProductIngredient | null>;
  create(entity: Partial<ProductIngredient>, manager?: unknown): Promise<ProductIngredient>;
  update(id: string, entity: Partial<ProductIngredient>, manager?: unknown): Promise<ProductIngredient | null>;
  softDelete(id: string, manager?: unknown): Promise<boolean>;
  delete(id: string, manager?: unknown): Promise<boolean>;
  deleteByProductId(productId: string, manager?: unknown): Promise<boolean>;
  findByProductId(productId: string): Promise<ProductIngredient[]>;
  createMany(entity: Partial<ProductIngredient>[], manager?: unknown): Promise<ProductIngredient[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, unknown>): Promise<[ProductIngredient[], number]>;
}
