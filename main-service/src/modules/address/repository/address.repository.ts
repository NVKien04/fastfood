import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/paganation';
import { AddressesEntity } from '#src/entities/addresses.entity';
import { IAddressRepository } from './address.repository.interface';

@Injectable()
export class AddressRepository implements IAddressRepository {
  constructor(
    @InjectRepository(AddressesEntity)
    private readonly repo: Repository<AddressesEntity>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<AddressesEntity> {
    return manager ? manager.getRepository(AddressesEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<AddressesEntity>,
    order?: FindOptionsOrder<AddressesEntity>,
    relations?: string[],
  ): Promise<AddressesEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(condition: FindOptionsWhere<AddressesEntity>, relations?: string[]): Promise<AddressesEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: string): Promise<AddressesEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<AddressesEntity> });
  }

  async create(entity: DeepPartial<AddressesEntity>, manager?: EntityManager): Promise<AddressesEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(
    id: string,
    entity: DeepPartial<AddressesEntity>,
    manager?: EntityManager,
  ): Promise<AddressesEntity | null> {
    const repo = this.getRepo(manager);
    const result = await repo.update(id as any, entity);
    if (result.affected && result.affected > 0) return this.findById(id);
    return null;
  }

  async softDelete(id: string, manager?: EntityManager): Promise<DeleteResult> {
    const repo = this.getRepo(manager);
    return repo.softDelete(id);
  }

  async delete(id: string, manager?: EntityManager): Promise<DeleteResult> {
    const repo = this.getRepo(manager);
    return repo.delete(id as any);
  }

  async createMany(entity: DeepPartial<AddressesEntity>[], manager?: EntityManager): Promise<AddressesEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[AddressesEntity[], number]> {
    const entity = 'addresses';
    const qb = this.repo.createQueryBuilder(entity);

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    return qb.getManyAndCount();
  }
}
