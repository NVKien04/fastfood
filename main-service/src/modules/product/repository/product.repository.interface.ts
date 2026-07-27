import { IBaseRepository } from '#src/shared/base/base.interface';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';
import { ProductEntity } from '#src/entities/product.entity';

export interface IProductRepository extends IBaseRepository<ProductEntity> {
  findById(id: string): Promise<ProductEntity | null>;
  GetPage(filterObj: filterObj): Promise<PaginationResponse<any>>;
}
