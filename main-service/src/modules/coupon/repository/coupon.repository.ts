import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/paganation';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { ICouponRepository } from './coupon.repository.interface';

@Injectable()
export class CouponsRepository implements ICouponRepository {
  constructor(
    @InjectRepository(CouponsEntity)
    private readonly repo: Repository<CouponsEntity>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<CouponsEntity> {
    return manager ? manager.getRepository(CouponsEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<CouponsEntity>,
    order?: FindOptionsOrder<CouponsEntity>,
    relations?: string[],
  ): Promise<CouponsEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(condition: FindOptionsWhere<CouponsEntity>, relations?: string[]): Promise<CouponsEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: string): Promise<CouponsEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<CouponsEntity> });
  }

  async create(entity: DeepPartial<CouponsEntity>, manager?: EntityManager): Promise<CouponsEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(id: string, entity: DeepPartial<CouponsEntity>, manager?: EntityManager): Promise<CouponsEntity | null> {
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

  async createMany(entity: DeepPartial<CouponsEntity>[], manager?: EntityManager): Promise<CouponsEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[CouponsEntity[], number]> {
    const entity = 'coupons';
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
