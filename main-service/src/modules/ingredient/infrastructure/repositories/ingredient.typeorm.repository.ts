import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { PaginationOptions } from '#src/common/core/pagination';
import { Ingredient } from '../../domain/entities/ingredient.domain';
import { IIngredientRepository } from '../../domain/repositories/ingredient.repository.interface';
import { IngredientMapper } from '../mappers/ingredient.mapper';

@Injectable()
export class IngredientTypeOrmRepository implements IIngredientRepository {
  constructor(
    @InjectRepository(IngredientsEntity)
    private readonly repo: Repository<IngredientsEntity>,
  ) {}

  async findAll(
    condition?: Partial<Ingredient>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Ingredient[]> {
    const where = condition
      ? (IngredientMapper.toOrmEntity(condition) as FindOptionsWhere<IngredientsEntity>)
      : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<IngredientsEntity>,
      relations: relations ?? [],
    });
    return IngredientMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<Ingredient>, relations?: string[]): Promise<Ingredient | null> {
    const where = IngredientMapper.toOrmEntity(condition) as FindOptionsWhere<IngredientsEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? IngredientMapper.toDomain(entity) : null;
  }

  async findById(id: number): Promise<Ingredient | null> {
    const entity = await this.repo.findOne({ where: { id } as FindOptionsWhere<IngredientsEntity> });
    return entity ? IngredientMapper.toDomain(entity) : null;
  }

  async create(entityData: Partial<Ingredient>): Promise<Ingredient> {
    const ormPayload = IngredientMapper.toOrmEntity(entityData);
    const obj = this.repo.create(ormPayload);
    const saved = await this.repo.save(obj);
    return IngredientMapper.toDomain(saved);
  }

  async update(id: number, entityData: Partial<Ingredient>): Promise<Ingredient | null> {
    const ormPayload = IngredientMapper.toOrmEntity(entityData);
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

  async createMany(entitiesData: Partial<Ingredient>[]): Promise<Ingredient[]> {
    const ormPayloads = entitiesData.map((data) => IngredientMapper.toOrmEntity(data));
    const entities = this.repo.create(ormPayloads);
    const saved = await this.repo.save(entities);
    return IngredientMapper.toDomainList(saved);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Ingredient[], number]> {
    const entity = 'ingredients';
    const qb = this.repo.createQueryBuilder(entity);

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [IngredientMapper.toDomainList(entities), total];
  }
}
