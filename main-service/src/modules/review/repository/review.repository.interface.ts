import { IBaseRepository } from '#src/shared/base/base.interface';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { ReviewEntity } from '#src/entities/reviews.entity';

export interface IReviewRepository extends IBaseRepository<ReviewEntity> {
  findById(id: string): Promise<ReviewEntity | null>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
