import { DeepPartial, DeleteResult, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { ProductIngredientsEntity } from '@/entities/product_ingredients.entity';
import { PaginationOptions } from '@/common/core/pagination';

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
  create(entity: DeepPartial<ProductIngredientsEntity>, manager?: unknown): Promise<ProductIngredientsEntity>;
  update(
    id: string,
    entity: DeepPartial<ProductIngredientsEntity>,
    manager?: unknown,
  ): Promise<ProductIngredientsEntity | null>;
  softDelete(id: string, manager?: unknown): Promise<DeleteResult>;
  delete(id: string, manager?: unknown): Promise<DeleteResult>;
  deleteByProductId(productId: string, manager?: unknown): Promise<DeleteResult>;
  findByProductId(productId: string): Promise<ProductIngredientsEntity[]>;
  createMany(entity: DeepPartial<ProductIngredientsEntity>[], manager?: unknown): Promise<ProductIngredientsEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[ProductIngredientsEntity[], number]>;
}
