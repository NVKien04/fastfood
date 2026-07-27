import { IBaseRepository } from '#src/shared/base/base.interface';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients.entity';

export interface IProductIngredientRepository extends IBaseRepository<ProductIngredientsEntity> {
  findById(id: string): Promise<ProductIngredientsEntity | null>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
