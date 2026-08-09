import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from '@/entities/user.entity';
import { PaginationOptions } from '@/common/core/pagination';
import { User } from '../../domain/entities/user.domain';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findAll(
    condition?: Partial<User>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<User[]> {
    const where = condition ? (UserMapper.toOrmEntity(condition) as FindOptionsWhere<UserEntity>) : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<UserEntity>,
      relations: relations ?? [],
    });
    return UserMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<User>, relations?: string[]): Promise<User | null> {
    const where = UserMapper.toOrmEntity(condition) as FindOptionsWhere<UserEntity>;
    if (!where || Object.keys(where).length === 0) {
      return null;
    }
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    if (!id) return null;
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<UserEntity> });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const entity = await this.repo.findOne({ where: { email } as FindOptionsWhere<UserEntity> });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async create(entityData: Partial<User>): Promise<User> {
    const ormPayload = UserMapper.toOrmEntity(entityData);
    const obj = this.repo.create(ormPayload);
    const saved = await this.repo.save(obj);
    return UserMapper.toDomain(saved);
  }

  async update(id: string, entityData: Partial<User>): Promise<User | null> {
    const ormPayload = UserMapper.toOrmEntity(entityData);
    if (!ormPayload || Object.keys(ormPayload).length === 0) {
      return this.findById(id);
    }
    const result = await this.repo.update(id, ormPayload);
    if (result.affected && result.affected > 0) {
      return this.findById(id);
    }
    return null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repo.softDelete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async createMany(entitiesData: Partial<User>[]): Promise<User[]> {
    const ormPayloads = entitiesData.map((data) => UserMapper.toOrmEntity(data));
    const entities = this.repo.create(ormPayloads);
    const saved = await this.repo.save(entities);
    return UserMapper.toDomainList(saved);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[User[], number]> {
    const entity = 'users';
    const qb = this.repo.createQueryBuilder(entity);

    if (where && Object.keys(where).length > 0) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      let sortField = options.orderBy;
      let sortDir: 'ASC' | 'DESC' = options.orderDirection ?? 'ASC';

      if (options.orderBy.includes(':')) {
        const [field, dir] = options.orderBy.split(':');
        sortField = field;
        if (dir && (dir.toUpperCase() === 'ASC' || dir.toUpperCase() === 'DESC')) {
          sortDir = dir.toUpperCase() as 'ASC' | 'DESC';
        }
      }

      qb.orderBy(`${entity}.${sortField}`, sortDir);
    }

    const [entities, total] = await qb.getManyAndCount();
    return [UserMapper.toDomainList(entities), total];
  }
}
