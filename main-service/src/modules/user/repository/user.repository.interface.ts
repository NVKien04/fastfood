import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { UserEntity } from '#src/entities/user.entity';
import { PaginationOptions } from '#src/common/core/pagination';

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
  softDelete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  createMany(entity: DeepPartial<UserEntity>[], manager?: EntityManager): Promise<UserEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[UserEntity[], number]>;
}
