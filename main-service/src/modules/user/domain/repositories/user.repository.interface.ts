import { PaginationOptions } from '@/common/core/pagination';
import { User } from '../entities/user.domain';

export interface IUserRepository {
  findAll(condition?: Partial<User>, order?: Record<string, 'ASC' | 'DESC'>, relations?: string[]): Promise<User[]>;
  findOne(condition: Partial<User>, relations?: string[]): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(entity: Partial<User>): Promise<User>;
  update(id: string, entity: Partial<User>): Promise<User | null>;
  softDelete(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  createMany(entities: Partial<User>[]): Promise<User[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[User[], number]>;
}
