import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { AddressesEntity } from '#src/entities/addresses.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

export interface IAddressRepository {
  findAll(
    condition?: FindOptionsWhere<AddressesEntity>,
    order?: FindOptionsOrder<AddressesEntity>,
    relations?: string[],
  ): Promise<AddressesEntity[]>;
  findOne(condition: FindOptionsWhere<AddressesEntity>, relations?: string[]): Promise<AddressesEntity | null>;
  findById(id: string): Promise<AddressesEntity | null>;
  create(entity: DeepPartial<AddressesEntity>, manager?: EntityManager): Promise<AddressesEntity>;
  update(id: string, entity: DeepPartial<AddressesEntity>, manager?: EntityManager): Promise<AddressesEntity | null>;
  softDelete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<AddressesEntity[]>, manager?: EntityManager): Promise<AddressesEntity[]>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
