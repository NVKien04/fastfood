import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationOptions } from '#src/common/core/paganation';
import { CombosEntity } from '#src/entities/combos.entity';
import { IComboRepository } from './combo.repository.interface';

@Injectable()
export class ComboRepository implements IComboRepository {
  constructor(
    @InjectRepository(CombosEntity)
    private readonly repo: Repository<CombosEntity>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<CombosEntity> {
    return manager ? manager.getRepository(CombosEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<CombosEntity>,
    order?: FindOptionsOrder<CombosEntity>,
    relations?: string[],
  ): Promise<CombosEntity[]> {
    return this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
  }

  async findOne(condition: FindOptionsWhere<CombosEntity>, relations?: string[]): Promise<CombosEntity | null> {
    return this.repo.findOne({ where: condition, relations: relations ?? [] });
  }

  async findById(id: string): Promise<CombosEntity | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<CombosEntity>, relations: ['comboItems'] });
  }

  async findBySlug(slug: string): Promise<CombosEntity | null> {
    return this.repo.findOne({ where: { slug } as FindOptionsWhere<CombosEntity>, relations: ['comboItems'] });
  }

  async create(entity: DeepPartial<CombosEntity>, manager?: EntityManager): Promise<CombosEntity> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    return repo.save(obj);
  }

  async update(id: string, entity: DeepPartial<CombosEntity>, manager?: EntityManager): Promise<CombosEntity | null> {
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

  async createMany(entity: DeepPartial<CombosEntity>[], manager?: EntityManager): Promise<CombosEntity[]> {
    const repo = this.getRepo(manager);
    const entities = repo.create(entity);
    return repo.save(entities);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[CombosEntity[], number]> {
    const entity = 'combos';
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
