import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/paganation';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients.entity';
import { IProductIngredientRepository } from './product-ingredient.repository.interface';

@Injectable()
export class ProductIngredientRepository implements IProductIngredientRepository {
  constructor(
    @InjectRepository(ProductIngredientsEntity)
    private readonly repo: Repository<ProductIngredientsEntity>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<ProductIngredientsEntity> {
    return manager ? manager.getRepository(ProductIngredientsEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<ProductIngredientsEntity>,
    order?: FindOptionsOrder<ProductIngredientsEntity>,
    relations?: string[],
  ): Promise<ProductIngredientsEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(
    condition: FindOptionsWhere<ProductIngredientsEntity>,
    relations?: string[],
  ): Promise<ProductIngredientsEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: string): Promise<ProductIngredientsEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<ProductIngredientsEntity> });
  }

  async create(
    entity: DeepPartial<ProductIngredientsEntity>,
    manager?: EntityManager,
  ): Promise<ProductIngredientsEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(
    id: string,
    entity: DeepPartial<ProductIngredientsEntity>,
    manager?: EntityManager,
  ): Promise<ProductIngredientsEntity | null> {
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

  async createMany(
    entity: DeepPartial<ProductIngredientsEntity>[],
    manager?: EntityManager,
  ): Promise<ProductIngredientsEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(
    options: PaginationOptions,
    where?: Record<string, any>,
  ): Promise<[ProductIngredientsEntity[], number]> {
    const entity = 'product_ingredients';
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
