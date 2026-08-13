import { PaginationOptions } from '@/common/core/pagination';
import { Review } from '@/modules/review/domain/entities/review.domain';

export interface IReviewRepository {
  findAll(condition?: Partial<Review>, order?: Record<string, 'ASC' | 'DESC'>, relations?: string[]): Promise<Review[]>;
  findOne(condition: Partial<Review>, relations?: string[]): Promise<Review | null>;
  findById(id: number): Promise<Review | null>;
  create(entity: Partial<Review>): Promise<Review>;
  update(id: number, entity: Partial<Review>): Promise<Review | null>;
  softDelete(id: number): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  createMany(entities: Partial<Review>[]): Promise<Review[]>;
  findPaginated(options: PaginationOptions, where?: Record<string, any>): Promise<[Review[], number]>;
}
