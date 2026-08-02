import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

export interface IIngredientRepository {
  findAll(
    condition?: FindOptionsWhere<IngredientsEntity>,
    order?: FindOptionsOrder<IngredientsEntity>,
    relations?: string[],
  ): Promise<IngredientsEntity[]>;
  findOne(condition: FindOptionsWhere<IngredientsEntity>, relations?: string[]): Promise<IngredientsEntity | null>;
  findById(id: number): Promise<IngredientsEntity | null>;
  create(entity: DeepPartial<IngredientsEntity>, manager?: EntityManager): Promise<IngredientsEntity>;
  update(
    id: number,
    entity: DeepPartial<IngredientsEntity>,
    manager?: EntityManager,
  ): Promise<IngredientsEntity | null>;
  softDelete(id: number, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: number, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<IngredientsEntity[]>, manager?: EntityManager): Promise<IngredientsEntity[]>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
