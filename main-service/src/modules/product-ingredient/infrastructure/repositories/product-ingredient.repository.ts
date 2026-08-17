import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '@/common/core';
import { ProductIngredientsEntity } from '@/entities';
import { ProductIngredient } from '@/modules/product-ingredient/domain/entities/product-ingredient.domain';
import { IProductIngredientRepository } from '@/modules/product-ingredient/domain/repositories/product-ingredient.repository.interface';
import { ProductIngredientMapper } from '@/modules/product-ingredient/infrastructure/mappers/product-ingredient.mapper';

@Injectable()
export class ProductIngredientRepository implements IProductIngredientRepository {
  constructor(
    @InjectRepository(ProductIngredientsEntity)
    private readonly repo: Repository<ProductIngredientsEntity>,
  ) {}

  private getRepo(manager?: unknown): Repository<ProductIngredientsEntity> {
    const em = manager as EntityManager | undefined;
    return em ? em.getRepository(ProductIngredientsEntity) : this.repo;
  }

  async findAll(
    condition?: Partial<ProductIngredient>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<ProductIngredient[]> {
    const where = condition
      ? (ProductIngredientMapper.toOrmEntity(condition) as FindOptionsWhere<ProductIngredientsEntity>)
      : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<ProductIngredientsEntity>,
      relations: relations ?? [],
    });
    return ProductIngredientMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<ProductIngredient>, relations?: string[]): Promise<ProductIngredient | null> {
    const where = ProductIngredientMapper.toOrmEntity(condition) as FindOptionsWhere<ProductIngredientsEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? ProductIngredientMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<ProductIngredient | null> {
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<ProductIngredientsEntity> });
    return entity ? ProductIngredientMapper.toDomain(entity) : null;
  }

  async create(entity: Partial<ProductIngredient>, manager?: unknown): Promise<ProductIngredient> {
    const repo = this.getRepo(manager);
    const ormPayload = ProductIngredientMapper.toOrmEntity(entity);
    const obj = repo.create(ormPayload);
    const saved = await repo.save(obj);
    const domain = ProductIngredientMapper.toDomain(saved);
    if (!domain) {
      throw new Error('Failed to map created product ingredient to domain');
    }
    return domain;
  }

  async update(id: string, entity: Partial<ProductIngredient>, manager?: unknown): Promise<ProductIngredient | null> {
    const repo = this.getRepo(manager);
    const ormPayload = ProductIngredientMapper.toOrmEntity(entity);
    const result = await repo.update(id, ormPayload);
    if (result.affected && result.affected > 0) return this.findById(id);
    return null;
  }

  async softDelete(id: string, manager?: unknown): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.softDelete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async delete(id: string, manager?: unknown): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.delete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async deleteByProductId(productId: string, manager?: unknown): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.delete({ productId } as FindOptionsWhere<ProductIngredientsEntity>);
    return Boolean(result.affected && result.affected > 0);
  }

  async findByProductId(productId: string): Promise<ProductIngredient[]> {
    const entities = await this.repo.find({ where: { productId } as FindOptionsWhere<ProductIngredientsEntity> });
    return ProductIngredientMapper.toDomainList(entities);
  }

  async createMany(entities: Partial<ProductIngredient>[], manager?: unknown): Promise<ProductIngredient[]> {
    const repo = this.getRepo(manager);
    const ormPayloads = entities.map((data) => ProductIngredientMapper.toOrmEntity(data));
    const created = repo.create(ormPayloads);
    const saved = await repo.save(created);
    return ProductIngredientMapper.toDomainList(saved);
  }

  async findPaginated(
    options: PaginationOptions,
    where?: Record<string, unknown>,
  ): Promise<[ProductIngredient[], number]> {
    const entity = 'product_ingredients';
    const qb = this.repo.createQueryBuilder(entity);

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [ProductIngredientMapper.toDomainList(entities), total];
  }
}
