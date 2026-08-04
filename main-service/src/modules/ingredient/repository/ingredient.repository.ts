import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/pagination';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { IIngredientRepository } from './ingredient.repository.interface';

@Injectable()
export class IngredientsRepository implements IIngredientRepository {
  constructor(
    @InjectRepository(IngredientsEntity)
    private readonly repo: Repository<IngredientsEntity>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<IngredientsEntity> {
    return manager ? manager.getRepository(IngredientsEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<IngredientsEntity>,
    order?: FindOptionsOrder<IngredientsEntity>,
    relations?: string[],
  ): Promise<IngredientsEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(
    condition: FindOptionsWhere<IngredientsEntity>,
    relations?: string[],
  ): Promise<IngredientsEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: number): Promise<IngredientsEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<IngredientsEntity> });
  }

  async create(entity: DeepPartial<IngredientsEntity>, manager?: EntityManager): Promise<IngredientsEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(
    id: number,
    entity: DeepPartial<IngredientsEntity>,
    manager?: EntityManager,
  ): Promise<IngredientsEntity | null> {
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

  async createMany(entity: DeepPartial<IngredientsEntity>[], manager?: EntityManager): Promise<IngredientsEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[IngredientsEntity[], number]> {
    const entity = 'ingredients';
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
