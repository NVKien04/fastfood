import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationResponse } from '#src/common/core/paganation';
import { ReviewEntity } from '#src/entities/reviews.entity';
import { IReviewRepository } from './review.repository.interface';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly repo: Repository<ReviewEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private getRepo(manager?: EntityManager): Repository<ReviewEntity> {
    return manager ? manager.getRepository(ReviewEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<ReviewEntity>,
    order?: FindOptionsOrder<ReviewEntity>,
    relations?: string[],
  ): Promise<ReviewEntity[]> {
    try {
      return await this.repo.find({ where: condition, order: order ?? {}, relations: relations ?? [] });
    } catch (error: any) {
      console.error(`[DB ERROR] findAll failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: 'Failed to fetch all records',
        detail: error.message,
      });
    }
  }

  async findOne(condition: FindOptionsWhere<ReviewEntity>, relations?: string[]): Promise<ReviewEntity | null> {
    try {
      return await this.repo.findOne({ where: condition, relations: relations ?? [] });
    } catch (error: any) {
      console.error(`[DB ERROR] findOne failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: 'Failed to fetch record',
        detail: error.message,
      });
    }
  }

  async findById(id: number): Promise<ReviewEntity | null> {
    try {
      return await this.repo.findOne({ where: { id } as FindOptionsWhere<ReviewEntity> });
    } catch (error: any) {
      console.error(`[DB ERROR] findById failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: `Failed to fetch record with id ${id}`,
        detail: error.message,
      });
    }
  }

  async create(entity: DeepPartial<ReviewEntity>, manager?: EntityManager): Promise<ReviewEntity> {
    try {
      const repo = this.getRepo(manager);
      const obj = repo.create(entity);
      return await repo.save(obj);
    } catch (error: any) {
      console.error(`[DB ERROR] create failed:`, error.message);
      if (error.code === '23505')
        throw new BadRequestException({
          errorCode: error.code,
          message: 'Dữ liệu bị trùng vui lòng thử lại',
          detail: error.detail || error.message,
        });
      throw new BadRequestException({ message: 'Failed to create record', detail: error.message });
    }
  }

  async update(id: number, entity: DeepPartial<ReviewEntity>, manager?: EntityManager): Promise<ReviewEntity | null> {
    try {
      const repo = this.getRepo(manager);
      const result = await repo.update(id as any, entity);
      if (result.affected && result.affected > 0) return this.findById(id);
      return null;
    } catch (error: any) {
      console.error(`[DB ERROR] update failed:`, error.message);
      if (error.code === '23505')
        throw new BadRequestException({
          errorCode: error.code,
          message: 'Dữ liệu bị trùng vui lòng thử lại',
          detail: error.detail || error.message,
        });
      throw new BadRequestException({
        errorCode: error.code,
        message: `Failed to update record with id ${id}`,
        detail: error.message,
      });
    }
  }

  async softDelete(id: number, manager?: EntityManager): Promise<{ message: string }> {
    try {
      const repo = this.getRepo(manager);
      const result = await repo.softDelete(id);
      if (result.affected && result.affected > 0) return { message: 'Deleted successfully' };
      return { message: 'No record found to delete' };
    } catch (error: any) {
      console.error(`[DB ERROR] softDelete failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: `Failed to delete record with id ${id}`,
        detail: error.message,
      });
    }
  }

  async delete(id: number, manager?: EntityManager): Promise<{ message: string }> {
    try {
      const repo = this.getRepo(manager);
      const result = await repo.delete(id as any);
      if (result.affected && result.affected > 0) return { message: 'Deleted successfully' };
      return { message: 'No record found to delete' };
    } catch (error: any) {
      console.error(`[DB ERROR] delete failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: `Failed to delete record with id ${id}`,
        detail: error.message,
      });
    }
  }

  async createMany(entity: DeepPartial<ReviewEntity[]>, manager?: EntityManager): Promise<ReviewEntity[]> {
    try {
      const repo = this.getRepo(manager);
      const entities = repo.create(entity as DeepPartial<ReviewEntity>[]);
      return await repo.save(entities);
    } catch (error: any) {
      if (error.code === '23505')
        throw new BadRequestException({
          errorCode: error.code,
          message: 'Dữ liệu bị trùng, không thể tạo mới',
          detail: error.detail,
        });
      if (error.code === '23503')
        throw new BadRequestException({
          errorCode: error.code,
          message: 'Không thể tạo vì vi phạm khóa ngoại',
          detail: error.detail,
        });
      throw new BadRequestException({ errorCode: error.code, message: 'Không thể tạo dữ liệu', error: error.message });
    }
  }

  async GetPage(filterObj?: any): Promise<PaginationResponse<any>> {
    console.log('🚀 ~ ReviewRepository ~ GetPage ~ :');
    try {
      const page = Number(filterObj?.page ?? 1);
      const limit = Number(filterObj?.limit ?? 10);
      const skip = (page - 1) * limit;
      const orderby = filterObj?.orderby;
      const entity = 'reviews';
      const relatedFields: any[] = [];
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

      if (orderby) qb.take(limit).skip(skip).orderBy(`${entity}.${orderby}`, 'ASC');
      else qb.take(limit).skip(skip);

      const [data, totalItems] = await qb.getManyAndCount();
      const totalPages = Math.ceil(totalItems / limit);
      const itemCount = data.length;

      return { data, meta: { totalItems, itemCount, itemsPerPage: limit, totalPages, currentPage: page } };
    } catch (error: any) {
      console.error(`[DB ERROR] GetPage failed:`, error.message);
      throw new BadRequestException({ message: 'Failed to fetch paged data', detail: error.message });
    }
  }
}
