import { CategoryEntity } from 'src/entities/category.entity';
import { IBaseRepository } from '../base/base.interface';
import { filterObj } from 'src/common/core/filterObj';
import { PaginationResponse } from 'src/common/core/paganation';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { ProductVariantsEntity } from '#src/entities/product_variants';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients';

export interface IProductIngredientRepository extends IBaseRepository<ProductIngredientsEntity> {
  findById(id: string): Promise<ProductIngredientsEntity | null>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
