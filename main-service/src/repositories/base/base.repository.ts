import {
  DataSource,
  Repository,
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
  FindOptionsOrder,
  EntityManager,
} from 'typeorm';
import { IBaseRepository } from './base.interface';
import { BadRequestException } from '@nestjs/common';
import { filterObj } from 'src/common/core/filterObj';
import { PaginationResponse } from 'src/common/core/paganation';

interface IBaseEntity {
  id: number | string;
}

export class BaseRepository<T extends ObjectLiteral & IBaseEntity> implements IBaseRepository<T> {
  protected readonly repo: Repository<T>;

  /**
   * Constructor accepts either a TypeORM DataSource or a Repository<T>.
   * If a DataSource is provided, `entity` must also be provided.
   */
  constructor(
    protected readonly dataSourceOrRepo: DataSource | Repository<T>,
    private readonly entity?: { new (): T },
  ) {
    // If a DataSource-like object is passed (has getRepository), use it to obtain the repository.
    if ((dataSourceOrRepo as any)?.getRepository && this.entity) {
      this.repo = (dataSourceOrRepo as DataSource).getRepository(this.entity);
    } else {
      // Otherwise assume a Repository<T> was injected directly.
      this.repo = dataSourceOrRepo as Repository<T>;
    }
  }

  protected getRepo(manager?: EntityManager): Repository<T> {
    if (!this.entity) {
      throw new Error('Entity is not defined');
    }
    return manager ? manager.getRepository(this.entity) : this.repo;
  }

  async findOne(condition: FindOptionsWhere<T>, relations?: string[]): Promise<T | null> {
    try {
      return await this.repo.findOne({
        where: condition,
        relations: relations || [],
      });
    } catch (error: any) {
      console.error(`[DB ERROR] findOne failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: 'Failed to fetch record',
        detail: error.message,
      });
    }
  }

  async softDelete(id: number | string): Promise<{ message: string }> {
    try {
      const result = await this.repo.softDelete(id);
      if (result.affected && result.affected > 0) {
        return { message: 'Deleted successfully' };
      }
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
  GetPage(filterObj: filterObj): Promise<PaginationResponse<any>> {
    throw new Error('Method not implemented.');
  }

  /**
   * Get all records of the entity.
   *
   * @returns {Promise<T[]>} List of all records
   */
  async findAll(condition?: FindOptionsWhere<T>, order?: FindOptionsOrder<T>, relations?: string[]): Promise<T[]> {
    try {
      return await this.repo.find({
        where: condition,
        order: order || {},
        relations: relations || [],
      });
    } catch (error: any) {
      console.error(`[DB ERROR] findAll failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: 'Failed to fetch all records',
        detail: error.message,
      });
    }
  }

  async findById(id: number | string): Promise<T | null> {
    try {
      return await this.repo.findOne({ where: { id } as FindOptionsWhere<T> });
    } catch (error: any) {
      console.error(`[DB ERROR] findById failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: `Failed to fetch record with id ${id}`,
        detail: error.message,
      });
    }
  }

  async create(entity: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    try {
      const repo = this.getRepo(manager);

      const obj = repo.create(entity);
      return await repo.save(obj);
    } catch (error: any) {
      console.error(`[DB ERROR] create failed:`, error.message);

      // PostgreSQL UNIQUE error
      if (error.code === '23505') {
        throw new BadRequestException({
          errorCode: error.code,
          message: 'Dữ liệu bị trùng vui lòng thử lại',
          detail: error.detail || error.message,
        });
      }

      // Default lỗi khác
      throw new BadRequestException({
        message: 'Failed to create record',
        detail: error.message,
      });
    }
  }

  async update(id: number | string, entity: DeepPartial<T>, manager?: EntityManager): Promise<T | null> {
    try {
      const repo = this.getRepo(manager);
      const result = await repo.update(id as any, entity);
      if (result.affected && result.affected > 0) {
        return this.findById(id);
      }
      return null;
    } catch (error: any) {
      console.error(`[DB ERROR] update failed:`, error.message);
      // PostgreSQL UNIQUE error
      if (error.code === '23505') {
        throw new BadRequestException({
          errorCode: error.code,
          message: 'Dữ liệu bị trùng vui lòng thử lại',
          detail: error.detail || error.message,
        });
      }
      throw new BadRequestException({
        errorCode: error.code,
        message: `Failed to update record with id ${id}`,
        detail: error.message,
      });
    }
  }
  async createMany(entity: DeepPartial<T[]>): Promise<T[]> {
    try {
      const entities = this.repo.create(entity);
      return await this.repo.save(entities);
    } catch (error: any) {
      // Lỗi UNIQUE (trùng dữ liệu)
      if (error.code === '23505') {
        throw new BadRequestException({
          errorCode: error.code,
          message: 'Dữ liệu bị trùng, không thể tạo mới',
          detail: error.detail,
        });
      }

      // Lỗi Foreign Key
      if (error.code === '23503') {
        throw new BadRequestException({
          errorCode: error.code,
          message: 'Không thể tạo vì vi phạm khóa ngoại',
          detail: error.detail,
        });
      }

      // Lỗi khác
      throw new BadRequestException({
        errorCode: error.code,
        message: 'Không thể tạo dữ liệu',
        error: error.message,
      });
    }
  }

  async delete(id: number | string, manager?: EntityManager): Promise<{ message: string }> {
    try {
      const repo = this.getRepo(manager);
      const result = await repo.delete(id as any);
      if (result.affected && result.affected > 0) {
        return { message: 'Deleted successfully' };
      }
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
}
