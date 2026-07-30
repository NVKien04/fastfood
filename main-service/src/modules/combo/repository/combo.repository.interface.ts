import { IBaseRepository } from '#src/shared/base/base.interface';
import { CombosEntity } from '#src/entities/combos.entity';

export interface IComboRepository extends IBaseRepository<CombosEntity> {
  findById(id: string): Promise<CombosEntity | null>;
  findBySlug(slug: string): Promise<CombosEntity | null>;
}
