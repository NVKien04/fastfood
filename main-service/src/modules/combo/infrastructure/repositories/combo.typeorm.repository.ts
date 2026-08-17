import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CombosEntity } from '@/entities';
import { PaginationOptions } from '@/common/core';
import { Combo } from '@/modules/combo/domain/entities/combo.domain';
import { IComboRepository } from '@/modules/combo/domain/repositories/combo.repository.interface';
import { ComboMapper } from '@/modules/combo/infrastructure/mappers/combo.mapper';

@Injectable()
export class ComboTypeOrmRepository implements IComboRepository {
  constructor(
    @InjectRepository(CombosEntity)
    private readonly repo: Repository<CombosEntity>,
  ) {}

  async findAll(
    condition?: Partial<Combo>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Combo[]> {
    const where = condition ? (ComboMapper.toOrmEntity(condition) as FindOptionsWhere<CombosEntity>) : undefined;
    const entities = await this.repo.find({
      where,
      order: (order ?? {}) as FindOptionsOrder<CombosEntity>,
      relations: relations ?? [],
    });
    return ComboMapper.toDomainList(entities);
  }

  async findOne(condition: Partial<Combo>, relations?: string[]): Promise<Combo | null> {
    const where = ComboMapper.toOrmEntity(condition) as FindOptionsWhere<CombosEntity>;
    const entity = await this.repo.findOne({ where, relations: relations ?? [] });
    return entity ? ComboMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<Combo | null> {
    const entity = await this.repo.findOne({
      where: { id } as FindOptionsWhere<CombosEntity>,
      relations: ['comboItems'],
    });
    return entity ? ComboMapper.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<Combo | null> {
    const entity = await this.repo.findOne({
      where: { slug } as FindOptionsWhere<CombosEntity>,
      relations: ['comboItems'],
    });
    return entity ? ComboMapper.toDomain(entity) : null;
  }

  async create(entityData: Partial<Combo>): Promise<Combo> {
    const ormPayload = ComboMapper.toOrmEntity(entityData);
    const obj = this.repo.create(ormPayload);
    const saved = await this.repo.save(obj);
    return ComboMapper.toDomain(saved);
  }

  async update(id: string, entityData: Partial<Combo>): Promise<Combo | null> {
    const ormPayload = ComboMapper.toOrmEntity(entityData);
    const result = await this.repo.update(id, ormPayload);
    if (result.affected && result.affected > 0) {
      return this.findById(id);
    }
    return null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repo.softDelete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return Boolean(result.affected && result.affected > 0);
  }

  async createMany(entitiesData: Partial<Combo>[]): Promise<Combo[]> {
    const ormPayloads = entitiesData.map((data) => ComboMapper.toOrmEntity(data));
    const entities = this.repo.create(ormPayloads);
    const saved = await this.repo.save(entities);
    return ComboMapper.toDomainList(saved);
  }

  async findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Combo[], number]> {
    const entity = 'combos';
    const qb = this.repo.createQueryBuilder(entity);

    if (where) {
      qb.where(where);
    }

    qb.take(options.take).skip(options.skip);

    if (options.orderBy) {
      qb.orderBy(`${entity}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    const [entities, total] = await qb.getManyAndCount();
    return [ComboMapper.toDomainList(entities), total];
  }
}
