import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { ProductEntity } from '@/entities/product.entity';
import { Product } from '@/modules/product/domain/entities/product.domain';
import {
  IProductRepository,
  ProductFilterOptions,
} from '@/modules/product/domain/repositories/product.repository.interface';
import { ProductMapper } from '@/modules/product/infrastructure/mappers/product.mapper';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  private getRepo(manager?: unknown): Repository<ProductEntity> {
    const em = manager as EntityManager | undefined;
    return em ? em.getRepository(ProductEntity) : this.repo;
  }

  async findAll(
    condition?: Partial<Product>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Product[]> {
    const where = condition ? (ProductMapper.toOrmEntity(condition) as FindOptionsWhere<ProductEntity>) : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<ProductEntity>,
      relations: relations ?? [],
    });
    return ProductMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<Product>, relations?: string[]): Promise<Product | null> {
    const where = ProductMapper.toOrmEntity(condition) as FindOptionsWhere<ProductEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<ProductEntity> });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async create(entityData: Partial<Product>, manager?: unknown): Promise<Product> {
    const repo = this.getRepo(manager);
    const ormPayload = ProductMapper.toOrmEntity(entityData);
    const obj = repo.create(ormPayload);
    const saved = await repo.save(obj);
    return ProductMapper.toDomain(saved);
  }

  async update(id: string, entityData: Partial<Product>, manager?: unknown): Promise<Product | null> {
    const repo = this.getRepo(manager);
    const ormPayload = ProductMapper.toOrmEntity(entityData);
    const result = await repo.update(id, ormPayload);
    if (result.affected && result.affected > 0) {
      return this.findById(id);
    }
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

  async createMany(entitiesData: Partial<Product>[], manager?: unknown): Promise<Product[]> {
    const repo = this.getRepo(manager);
    const ormPayloads = entitiesData.map((data) => ProductMapper.toOrmEntity(data));
    const entities = repo.create(ormPayloads);
    const saved = await repo.save(entities);
    return ProductMapper.toDomainList(saved);
  }

  async findPaginated(options: ProductFilterOptions): Promise<[Product[], number]> {
    const entity = 'product';
    const qb = this.repo.createQueryBuilder(entity);

    if (options.search) {
      qb.andWhere('(LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search)', {
        search: `%${options.search.toLowerCase().trim()}%`,
      });
    }

    if (options.categoryId !== undefined) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId: options.categoryId });
    }

    if (options.isFeatured !== undefined) {
      qb.andWhere('product.isFeatured = :isFeatured', { isFeatured: options.isFeatured });
    }

    if (options.isActive !== undefined) {
      qb.andWhere('product.isActive = :isActive', { isActive: options.isActive });
    }

    if (options.minPrice !== undefined) {
      qb.andWhere('product.basePrice >= :minPrice', { minPrice: options.minPrice });
    }

    if (options.maxPrice !== undefined) {
      qb.andWhere('product.basePrice <= :maxPrice', { maxPrice: options.maxPrice });
    }

    qb.take(options.take).skip(options.skip);

    const allowedSortFields = ['sortOrder', 'basePrice', 'createdAt', 'name', 'isFeatured'];
    const sortField = options.orderBy && allowedSortFields.includes(options.orderBy) ? options.orderBy : 'sortOrder';
    const sortDirection = options.orderDirection === 'DESC' ? 'DESC' : 'ASC';
    qb.orderBy(`${entity}.${sortField}`, sortDirection);
    if (sortField !== 'createdAt') {
      qb.addOrderBy(`${entity}.createdAt`, 'DESC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [ProductMapper.toDomainList(entities), total];
  }

  async executeTransaction<T>(callback: (manager: unknown) => Promise<T>): Promise<T> {
    return this.repo.manager.transaction(callback);
  }
}
