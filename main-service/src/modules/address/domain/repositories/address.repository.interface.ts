import { PaginationOptions } from '@/common/core/pagination';
import { Address } from '@/modules/address/domain/entities/address.domain';

export interface IAddressRepository {
  findAll(
    condition?: Partial<Address>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Address[]>;
  findOne(condition: Partial<Address>, relations?: string[]): Promise<Address | null>;
  findById(id: string): Promise<Address | null>;
  create(entity: Partial<Address>): Promise<Address>;
  update(id: string, entity: Partial<Address>): Promise<Address | null>;
  softDelete(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  createMany(entities: Partial<Address>[]): Promise<Address[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Address[], number]>;
}
