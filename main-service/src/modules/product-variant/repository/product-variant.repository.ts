import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/pagination';
import { ProductVariantsEntity } from '#src/entities/product_variants.entity';
import { IProductVariantRepository } from './product-variant.repository.interface';

@Injectable()
export class ProductVariantRepository implements IProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariantsEntity)
    private readonly repo: Repository<ProductVariantsEntity>,
  ) {}

  private getRepo(manager?: unknown): Repository<ProductVariantsEntity> {
    const em = manager as EntityManager | undefined;
    return em ? em.getRepository(ProductVariantsEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<ProductVariantsEntity>,
    order?: FindOptionsOrder<ProductVariantsEntity>,
    relations?: string[],
  ): Promise<ProductVariantsEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(
    condition: FindOptionsWhere<ProductVariantsEntity>,
    relations?: string[],
  ): Promise<ProductVariantsEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: number): Promise<ProductVariantsEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<ProductVariantsEntity> });
  }

  async create(entity: DeepPartial<ProductVariantsEntity>, manager?: unknown): Promise<ProductVariantsEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(
    id: number,
    entity: DeepPartial<ProductVariantsEntity>,
    manager?: unknown,
  ): Promise<ProductVariantsEntity | null> {
    const repo = this.getRepo(manager);
    const result = await repo.update(id as any, entity);
    if (result.affected && result.affected > 0) return this.findById(id);
    return null;
  }

  async softDelete(id: number, manager?: unknown): Promise<DeleteResult> {
    const repo = this.getRepo(manager);
    return repo.softDelete(id);
  }

  async delete(id: number, manager?: unknown): Promise<DeleteResult> {
    const repo = this.getRepo(manager);
    return repo.delete(id as any);
  }

  async createMany(entity: DeepPartial<ProductVariantsEntity>[], manager?: unknown): Promise<ProductVariantsEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(
    options: PaginationOptions,
    where?: Record<string, any>,
  ): Promise<[ProductVariantsEntity[], number]> {
    const entity = 'product_variants';
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
