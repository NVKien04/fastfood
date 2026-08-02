import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { UserEntity } from '#src/entities/user.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

export interface IUserRepository {
  findAll(
    condition?: FindOptionsWhere<UserEntity>,
    order?: FindOptionsOrder<UserEntity>,
    relations?: string[],
  ): Promise<UserEntity[]>;
  findOne(condition: FindOptionsWhere<UserEntity>, relations?: string[]): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(entity: DeepPartial<UserEntity>, manager?: EntityManager): Promise<UserEntity>;
  update(id: string, entity: DeepPartial<UserEntity>, manager?: EntityManager): Promise<UserEntity | null>;
  softDelete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<UserEntity[]>, manager?: EntityManager): Promise<UserEntity[]>;
  GetPage(filterObj: filterObj, userScope?: any): Promise<PaginationResponse<any>>;
}
