import { IBaseRepository } from '#src/shared/base/base.interface';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';
import { IngredientsEntity } from '#src/entities/ingredients.entity';

export interface IIngredientRepository extends IBaseRepository<IngredientsEntity> {
  findById(id: number): Promise<IngredientsEntity | null>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
