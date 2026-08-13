import { PaginationOptions } from '@/common/core/pagination';
import { Ingredient } from '@/modules/ingredient/domain/entities/ingredient.domain';

export interface IIngredientRepository {
  findAll(
    condition?: Partial<Ingredient>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Ingredient[]>;
  findOne(condition: Partial<Ingredient>, relations?: string[]): Promise<Ingredient | null>;
  findById(id: number): Promise<Ingredient | null>;
  findByIds(ids: number[]): Promise<Ingredient[]>;
  create(entity: Partial<Ingredient>): Promise<Ingredient>;
  update(id: number, entity: Partial<Ingredient>): Promise<Ingredient | null>;
  softDelete(id: number): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  createMany(entities: Partial<Ingredient>[]): Promise<Ingredient[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Ingredient[], number]>;
}
