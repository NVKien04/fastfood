import { PaginationOptions } from '#src/common/core/pagination';
import { Category } from './category.domain';

export interface ICategoryRepository {
  findAll(
    condition?: Partial<Category>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Category[]>;
  findOne(condition: Partial<Category>, relations?: string[]): Promise<Category | null>;
  findById(id: number): Promise<Category | null>;
  create(entity: Partial<Category>): Promise<Category>;
  update(id: number, entity: Partial<Category>): Promise<Category | null>;
  softDelete(id: number): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  createMany(entities: Partial<Category>[]): Promise<Category[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Category[], number]>;
}
