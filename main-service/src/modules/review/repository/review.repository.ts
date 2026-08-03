import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/paganation';
import { ReviewEntity } from '#src/entities/reviews.entity';
import { IReviewRepository } from './review.repository.interface';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repo: Repository<ReviewEntity>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<ReviewEntity> {
    return manager ? manager.getRepository(ReviewEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<ReviewEntity>,
    order?: FindOptionsOrder<ReviewEntity>,
    relations?: string[],
  ): Promise<ReviewEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(condition: FindOptionsWhere<ReviewEntity>, relations?: string[]): Promise<ReviewEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: number): Promise<ReviewEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<ReviewEntity> });
  }

  async create(entity: DeepPartial<ReviewEntity>, manager?: EntityManager): Promise<ReviewEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(id: number, entity: DeepPartial<ReviewEntity>, manager?: EntityManager): Promise<ReviewEntity | null> {
    const repo = this.getRepo(manager);
    const result = await repo.update(id as any, entity);
    if (result.affected && result.affected > 0) return this.findById(id);
    return null;
  }

  async softDelete(id: number, manager?: EntityManager): Promise<DeleteResult> {
    const repo = this.getRepo(manager);
    return repo.softDelete(id);
  }

  async delete(id: number, manager?: EntityManager): Promise<DeleteResult> {
    const repo = this.getRepo(manager);
    return repo.delete(id as any);
  }

  async createMany(entity: DeepPartial<ReviewEntity>[], manager?: EntityManager): Promise<ReviewEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[ReviewEntity[], number]> {
    const entity = 'reviews';
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
