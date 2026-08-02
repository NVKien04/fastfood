import { DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CombosEntity } from '#src/entities/combos.entity';
import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';

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
  softDelete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  delete(id: string, manager?: EntityManager): Promise<{ message: string }>;
  createMany(entity: DeepPartial<CombosEntity[]>, manager?: EntityManager): Promise<CombosEntity[]>;
  GetPage(filterObj?: filterObj): Promise<PaginationResponse<any>>;
}
