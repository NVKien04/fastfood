import { DeepPartial, DeleteResult, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CombosEntity } from '#src/entities/combos.entity';
import { PaginationOptions } from '#src/common/core/paganation';

export interface IComboRepository {
  findAll(
    condition?: FindOptionsWhere<CombosEntity>,
    order?: FindOptionsOrder<CombosEntity>,
    relations?: string[],
  ): Promise<CombosEntity[]>;
  findOne(condition: FindOptionsWhere<CombosEntity>, relations?: string[]): Promise<CombosEntity | null>;
  findById(id: string): Promise<CombosEntity | null>;
  findBySlug(slug: string): Promise<CombosEntity | null>;
  create(entity: DeepPartial<CombosEntity>, manager?: EntityManager): Promise<CombosEntity>;
  update(id: string, entity: DeepPartial<CombosEntity>, manager?: EntityManager): Promise<CombosEntity | null>;
  softDelete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  delete(id: string, manager?: EntityManager): Promise<DeleteResult>;
  createMany(entity: DeepPartial<CombosEntity>[], manager?: EntityManager): Promise<CombosEntity[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[CombosEntity[], number]>;
}
