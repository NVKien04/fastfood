import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/paganation';
import { ProductEntity } from '#src/entities/product.entity';
import { IProductRepository } from './product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<ProductEntity> {
    return manager ? manager.getRepository(ProductEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<ProductEntity>,
    order?: FindOptionsOrder<ProductEntity>,
    relations?: string[],
  ): Promise<ProductEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(condition: FindOptionsWhere<ProductEntity>, relations?: string[]): Promise<ProductEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<ProductEntity> });
  }

  async create(entity: DeepPartial<ProductEntity>, manager?: EntityManager): Promise<ProductEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(id: string, entity: DeepPartial<ProductEntity>, manager?: EntityManager): Promise<ProductEntity | null> {
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

  async createMany(entity: DeepPartial<ProductEntity>[], manager?: EntityManager): Promise<ProductEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[ProductEntity[], number]> {
    const entity = 'product';
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
