import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '@/common/core';
import { ProductVariantsEntity } from '@/entities';
import { ProductVariant } from '@/modules/product-variant/domain/entities/product-variant.domain';
import { IProductVariantRepository } from '@/modules/product-variant/domain/repositories/product-variant.repository.interface';
import { ProductVariantMapper } from '@/modules/product-variant/infrastructure/mappers/product-variant.mapper';

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
    condition?: Partial<ProductVariant>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<ProductVariant[]> {
    const where = condition
      ? (ProductVariantMapper.toOrmEntity(condition) as FindOptionsWhere<ProductVariantsEntity>)
      : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<ProductVariantsEntity>,
      relations: relations ?? [],
    });
    return ProductVariantMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<ProductVariant>, relations?: string[]): Promise<ProductVariant | null> {
    const where = ProductVariantMapper.toOrmEntity(condition) as FindOptionsWhere<ProductVariantsEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? ProductVariantMapper.toDomain(entity) : null;
  }

  async findById(id: number): Promise<ProductVariant | null> {
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<ProductVariantsEntity> });
    return entity ? ProductVariantMapper.toDomain(entity) : null;
  }

  async create(entity: Partial<ProductVariant>, manager?: unknown): Promise<ProductVariant> {
    const repo = this.getRepo(manager);
    const ormPayload = ProductVariantMapper.toOrmEntity(entity);
    const obj = repo.create(ormPayload);
    const saved = await repo.save(obj);
    const domain = ProductVariantMapper.toDomain(saved);
    if (!domain) {
      throw new Error('Failed to map created product variant to domain');
    }
    return domain;
  }

  async update(id: number, entity: Partial<ProductVariant>, manager?: unknown): Promise<ProductVariant | null> {
    const repo = this.getRepo(manager);
    const ormPayload = ProductVariantMapper.toOrmEntity(entity);
    const result = await repo.update(id, ormPayload);
    if (result.affected && result.affected > 0) return this.findById(id);
    return null;
  }

  async softDelete(id: number, manager?: unknown): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.softDelete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async delete(id: number, manager?: unknown): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.delete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async deleteByProductId(productId: string, manager?: unknown): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.delete({ productId } as FindOptionsWhere<ProductVariantsEntity>);
    return Boolean(result.affected && result.affected > 0);
  }

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    const entities = await this.repo.find({ where: { productId } as FindOptionsWhere<ProductVariantsEntity> });
    return ProductVariantMapper.toDomainList(entities);
  }

  async createMany(entities: Partial<ProductVariant>[], manager?: unknown): Promise<ProductVariant[]> {
    const repo = this.getRepo(manager);
    const ormPayloads = entities.map((data) => ProductVariantMapper.toOrmEntity(data));
    const created = repo.create(ormPayloads);
    const saved = await repo.save(created);
    return ProductVariantMapper.toDomainList(saved);
  }

  async findPaginated(
    options: PaginationOptions,
    where?: Record<string, unknown>,
  ): Promise<[ProductVariant[], number]> {
    const entity = 'product_variants';
    const qb = this.repo.createQueryBuilder(entity);

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [ProductVariantMapper.toDomainList(entities), total];
  }
}
