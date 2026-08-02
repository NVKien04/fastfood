import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

export interface IProductIngredientRepository {
  findAll(
    condition?: FindOptionsWhere<ProductIngredientsEntity>,
    order?: FindOptionsOrder<ProductIngredientsEntity>,
    relations?: string[],
  ): Promise<ProductIngredientsEntity[]>;
  findOne(
    condition: FindOptionsWhere<ProductIngredientsEntity>,
    relations?: string[],
  ): Promise<ProductIngredientsEntity | null>;
  findById(id: string): Promise<ProductIngredientsEntity | null>;
  create(entity: DeepPartial<ProductIngredientsEntity>, manager?: EntityManager): Promise<ProductIngredientsEntity>;
  update(
    id: string,
    entity: DeepPartial<ProductIngredientsEntity>,
    manager?: EntityManager,
  ): Promise<ProductIngredientsEntity | null>;
  softDelete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  createMany(
    entity: DeepPartial<ProductIngredientsEntity[]>,
    manager?: EntityManager,
  ): Promise<ProductIngredientsEntity[]>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
