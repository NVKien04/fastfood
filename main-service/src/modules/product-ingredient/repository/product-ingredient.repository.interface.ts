import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients.entity';
import { PaginationOptions } from '#src/common/core/pagination';

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
  softDelete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  createMany(
    entity: DeepPartial<ProductIngredientsEntity>[],
    manager?: EntityManager,
  ): Promise<ProductIngredientsEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[ProductIngredientsEntity[], number]>;
}
