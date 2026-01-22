import { CategoryEntity } from 'src/entities/category.entity';
import { IBaseRepository } from '../base/base.interface';
import { filterObj } from 'src/common/core/filterObj';
import { PaginationResponse } from 'src/common/core/paganation';
import { IngredientsEntity } from '#src/entities/ingredients.entity';

export interface IIngredientRepository extends IBaseRepository<IngredientsEntity> {
  findById(id: string): Promise<IngredientsEntity | null>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
