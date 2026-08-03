import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/paganation';
import { CategoryEntity } from '#src/entities/category.entity';
import { ICategoryRepository } from './category.repository.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<CategoryEntity> {
    return manager ? manager.getRepository(CategoryEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<CategoryEntity>,
    order?: FindOptionsOrder<CategoryEntity>,
    relations?: string[],
  ): Promise<CategoryEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(condition: FindOptionsWhere<CategoryEntity>, relations?: string[]): Promise<CategoryEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<CategoryEntity> });
  }

  async create(entity: DeepPartial<CategoryEntity>, manager?: EntityManager): Promise<CategoryEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(
    id: number,
    entity: DeepPartial<CategoryEntity>,
    manager?: EntityManager,
  ): Promise<CategoryEntity | null> {
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

  async createMany(entity: DeepPartial<CategoryEntity>[], manager?: EntityManager): Promise<CategoryEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[CategoryEntity[], number]> {
    const entity = 'category';
    const relatedFields = [{ field: 'products', alias: 'products', select: ['id', 'name'] }];
    const qb = this.repo.createQueryBuilder(entity);

    if (relatedFields.length > 0) {
      relatedFields.forEach((field: any) => {
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

    return qb.getManyAndCount();
  }
}
