import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { ReviewEntity } from '@/entities/reviews.entity';
import { PaginationOptions } from '@/common/core/pagination';
import { Review } from '@/modules/review/domain/entities/review.domain';
import { IReviewRepository } from '@/modules/review/domain/repositories/review.repository.interface';
import { ReviewMapper } from '@/modules/review/infrastructure/mappers/review.mapper';

@Injectable()
export class ReviewTypeOrmRepository implements IReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repo: Repository<ReviewEntity>,
  ) {}

  async findAll(
    condition?: Partial<Review>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Review[]> {
    const where = condition ? (ReviewMapper.toOrmEntity(condition) as FindOptionsWhere<ReviewEntity>) : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<ReviewEntity>,
      relations: relations ?? [],
    });
    return ReviewMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<Review>, relations?: string[]): Promise<Review | null> {
    const where = ReviewMapper.toOrmEntity(condition) as FindOptionsWhere<ReviewEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? ReviewMapper.toDomain(entity) : null;
  }

  async findById(id: number): Promise<Review | null> {
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<ReviewEntity> });
    return entity ? ReviewMapper.toDomain(entity) : null;
  }

  async create(entityData: Partial<Review>): Promise<Review> {
    const ormPayload = ReviewMapper.toOrmEntity(entityData);
    const obj = this.repo.create(ormPayload);
    const saved = await this.repo.save(obj);
    return ReviewMapper.toDomain(saved);
  }

  async update(id: number, entityData: Partial<Review>): Promise<Review | null> {
    const ormPayload = ReviewMapper.toOrmEntity(entityData);
    const result = await this.repo.update(id, ormPayload);
    if (result.affected && result.affected > 0) {
      return this.findById(id);
    }
    return null;
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repo.softDelete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async createMany(entitiesData: Partial<Review>[]): Promise<Review[]> {
    const ormPayloads = entitiesData.map((data) => ReviewMapper.toOrmEntity(data));
    const entities = this.repo.create(ormPayloads);
    const saved = await this.repo.save(entities);
    return ReviewMapper.toDomainList(saved);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Review[], number]> {
    const entity = 'reviews';
    const qb = this.repo.createQueryBuilder(entity);

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [ReviewMapper.toDomainList(entities), total];
  }
}
