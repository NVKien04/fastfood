import { IBaseRepository } from '#src/shared/base/base.interface';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { CouponsEntity } from '#src/entities/coupons.entity';

export interface ICouponRepository extends IBaseRepository<CouponsEntity> {
  findById(id: string): Promise<CouponsEntity | null>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
