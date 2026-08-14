import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CouponsEntity } from '@/entities/coupons.entity';
import { PaginationOptions } from '@/common/core/pagination';
import { Coupon } from '@/modules/coupon/domain/entities/coupon.domain';
import { ICouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository.interface';
import { CouponMapper } from '@/modules/coupon/infrastructure/mappers/coupon.mapper';

@Injectable()
export class CouponTypeOrmRepository implements ICouponRepository {
  constructor(
    @InjectRepository(CouponsEntity)
    private readonly repo: Repository<CouponsEntity>,
  ) {}

  async findAll(
    condition?: Partial<Coupon>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Coupon[]> {
    const where = condition ? (CouponMapper.toOrmEntity(condition) as FindOptionsWhere<CouponsEntity>) : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<CouponsEntity>,
      relations: relations ?? [],
    });
    return CouponMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<Coupon>, relations?: string[]): Promise<Coupon | null> {
    const where = CouponMapper.toOrmEntity(condition) as FindOptionsWhere<CouponsEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? CouponMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<Coupon | null> {
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<CouponsEntity> });
    return entity ? CouponMapper.toDomain(entity) : null;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const entity = await this.repo.findOne({
      where: { code: code.toUpperCase() } as FindOptionsWhere<CouponsEntity>,
    });
    return entity ? CouponMapper.toDomain(entity) : null;
  }

  async incrementUsage(id: string): Promise<boolean> {
    const result = await this.repo.increment({ id }, 'currentUses', 1);
    return Boolean(result.affected && result.affected > 0);
  }

  async create(entityData: Partial<Coupon>): Promise<Coupon> {
    const ormPayload = CouponMapper.toOrmEntity(entityData);
    const obj = this.repo.create(ormPayload);
    const saved = await this.repo.save(obj);
    return CouponMapper.toDomain(saved);
  }

  async update(id: string, entityData: Partial<Coupon>): Promise<Coupon | null> {
    const ormPayload = CouponMapper.toOrmEntity(entityData);
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

  async createMany(entitiesData: Partial<Coupon>[]): Promise<Coupon[]> {
    const ormPayloads = entitiesData.map((data) => CouponMapper.toOrmEntity(data));
    const entities = this.repo.create(ormPayloads);
    const saved = await this.repo.save(entities);
    return CouponMapper.toDomainList(saved);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, unknown>): Promise<[Coupon[], number]> {
    const entity = 'coupons';
    const qb = this.repo.createQueryBuilder(entity);

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [CouponMapper.toDomainList(entities), total];
  }
}
