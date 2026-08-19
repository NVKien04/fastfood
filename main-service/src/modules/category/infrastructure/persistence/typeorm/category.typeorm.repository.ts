import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CategoryEntity } from '@/entities';
import { PaginationOptions } from '@/common/core';
import { type QueryWhere } from '@/common/types';
import { Category } from '@/modules/category/domain/entities/category.domain';
import { ICategoryRepository } from '@/modules/category/domain/repositories/category.repository.interface';
import { CategoryMapper } from '@/modules/category/infrastructure/mappers/category.mapper';

@Injectable()
export class CategoryTypeOrmRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async findAll(
    condition?: Partial<Category>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Category[]> {
    const where = condition ? (CategoryMapper.toOrmEntity(condition) as FindOptionsWhere<CategoryEntity>) : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<CategoryEntity>,
      relations: relations ?? [],
    });
    return CategoryMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<Category>, relations?: string[]): Promise<Category | null> {
    const where = CategoryMapper.toOrmEntity(condition) as FindOptionsWhere<CategoryEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async findById(id: number): Promise<Category | null> {
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<CategoryEntity> });
    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async create(entityData: Partial<Category>): Promise<Category> {
    const ormPayload = CategoryMapper.toOrmEntity(entityData);
    const obj = this.repo.create(ormPayload);
    const saved = await this.repo.save(obj);
    return CategoryMapper.toDomain(saved);
  }

  async update(id: number, entityData: Partial<Category>): Promise<Category | null> {
    const ormPayload = CategoryMapper.toOrmEntity(entityData);
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

  async createMany(entitiesData: Partial<Category>[]): Promise<Category[]> {
    const ormPayloads = entitiesData.map((data) => CategoryMapper.toOrmEntity(data));
    const entities = this.repo.create(ormPayloads);
    const saved = await this.repo.save(entities);
    return CategoryMapper.toDomainList(saved);
  }

  async findPaginated(options: PaginationOptions, where?: QueryWhere): Promise<[Category[], number]> {
    const entity = 'category';
    const relatedFields = [{ field: 'products', alias: 'products', select: ['id', 'name'] }];
    const qb = this.repo.createQueryBuilder(entity);

    if (relatedFields.length > 0) {
      relatedFields.forEach((field) => {
        qb.leftJoin(`${entity}.${field.field}`, field.alias);
        if (field.select?.length) {
          const cols = field.select.map((c: string) => `${field.alias}.${c}`);
          qb.addSelect(cols);
        }
      });
    }

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [CategoryMapper.toDomainList(entities), total];
  }
}
