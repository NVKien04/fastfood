import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { AddressesEntity } from '@/entities';
import { PaginationOptions } from '@/common/core';
import { Address } from '@/modules/address/domain/entities/address.domain';
import { IAddressRepository } from '@/modules/address/domain/repositories/address.repository.interface';
import { AddressMapper } from '@/modules/address/infrastructure/mappers/address.mapper';

@Injectable()
export class AddressTypeOrmRepository implements IAddressRepository {
  constructor(
    @InjectRepository(AddressesEntity)
    private readonly repo: Repository<AddressesEntity>,
  ) {}

  async findAll(
    condition?: Partial<Address>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Address[]> {
    const where = condition ? (AddressMapper.toOrmEntity(condition) as FindOptionsWhere<AddressesEntity>) : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<AddressesEntity>,
      relations: relations ?? [],
    });
    return AddressMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<Address>, relations?: string[]): Promise<Address | null> {
    const where = AddressMapper.toOrmEntity(condition) as FindOptionsWhere<AddressesEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? AddressMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<Address | null> {
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<AddressesEntity> });
    return entity ? AddressMapper.toDomain(entity) : null;
  }

  async create(entityData: Partial<Address>): Promise<Address> {
    const ormPayload = AddressMapper.toOrmEntity(entityData);
    const obj = this.repo.create(ormPayload);
    const saved = await this.repo.save(obj);
    return AddressMapper.toDomain(saved);
  }

  async update(id: string, entityData: Partial<Address>): Promise<Address | null> {
    const ormPayload = AddressMapper.toOrmEntity(entityData);
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

  async createMany(entitiesData: Partial<Address>[]): Promise<Address[]> {
    const ormPayloads = entitiesData.map((data) => AddressMapper.toOrmEntity(data));
    const entities = this.repo.create(ormPayloads);
    const saved = await this.repo.save(entities);
    return AddressMapper.toDomainList(saved);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Address[], number]> {
    const entity = 'addresses';
    const qb = this.repo.createQueryBuilder(entity);

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [AddressMapper.toDomainList(entities), total];
  }
}
