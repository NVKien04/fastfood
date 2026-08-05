import { PaginationOptions } from '#src/common/core/pagination';
import { Combo } from './combo.domain';

export interface IComboRepository {
  findAll(condition?: Partial<Combo>, order?: Record<string, 'ASC' | 'DESC'>, relations?: string[]): Promise<Combo[]>;
  findOne(condition: Partial<Combo>, relations?: string[]): Promise<Combo | null>;
  findById(id: string): Promise<Combo | null>;
  findBySlug(slug: string): Promise<Combo | null>;
  create(entity: Partial<Combo>): Promise<Combo>;
  update(id: string, entity: Partial<Combo>): Promise<Combo | null>;
  softDelete(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  createMany(entities: Partial<Combo>[]): Promise<Combo[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Combo[], number]>;
}
