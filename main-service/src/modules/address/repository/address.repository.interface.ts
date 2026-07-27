import { IBaseRepository } from '#src/shared/base/base.interface';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';
import { AddressesEntity } from '#src/entities/addresses.entity';

export interface IAddressRepository extends IBaseRepository<AddressesEntity> {
  findById(id: string): Promise<AddressesEntity | null>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
