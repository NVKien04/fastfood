import { CategoryEntity } from '#src/entities/category.entity';
import { IBaseRepository } from '#src/shared/base/base.interface';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

export interface ICategoryRepository extends IBaseRepository<CategoryEntity> {
  findById(id: number): Promise<CategoryEntity | null>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
