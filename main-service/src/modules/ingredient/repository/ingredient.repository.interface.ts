import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { PaginationOptions } from '#src/common/core/paganation';

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
  softDelete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: number, manager?: EntityManager): Promise<DeleteResult>;
  createMany(entity: DeepPartial<IngredientsEntity>[], manager?: EntityManager): Promise<IngredientsEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[IngredientsEntity[], number]>;
}
