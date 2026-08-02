import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationResponse } from '#src/common/core/paganation';
import { AddressesEntity } from '#src/entities/addresses.entity';
import { IAddressRepository } from './address.repository.interface';

@Injectable()
export class AddressRepository implements IAddressRepository {
  constructor(
    @InjectRepository(AddressesEntity)
    private readonly repo: Repository<AddressesEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private getRepo(manager?: EntityManager): Repository<AddressesEntity> {
    return manager ? manager.getRepository(AddressesEntity) : this.repo;
  }

  async findAll(
    condition?: FindOptionsWhere<AddressesEntity>,
    order?: FindOptionsOrder<AddressesEntity>,
    relations?: string[],
  ): Promise<AddressesEntity[]> {
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

  async findOne(condition: FindOptionsWhere<AddressesEntity>, relations?: string[]): Promise<AddressesEntity | null> {
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

  async findById(id: string): Promise<AddressesEntity | null> {
    try {
      return await this.repo.findOne({ where: { id } as FindOptionsWhere<AddressesEntity> });
    } catch (error: any) {
      console.error(`[DB ERROR] findById failed:`, error.message);
      throw new BadRequestException({
        errorCode: error.code,
        message: `Failed to fetch record with id ${id}`,
        detail: error.message,
      });
    }
  }

  async create(entity: DeepPartial<AddressesEntity>, manager?: EntityManager): Promise<AddressesEntity> {
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

  async update(
    id: string,
    entity: DeepPartial<AddressesEntity>,
    manager?: EntityManager,
  ): Promise<AddressesEntity | null> {
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

  async softDelete(id: string, manager?: EntityManager): Promise<{ message: string }> {
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

  async delete(id: string, manager?: EntityManager): Promise<{ message: string }> {
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

  async createMany(entity: DeepPartial<AddressesEntity[]>, manager?: EntityManager): Promise<AddressesEntity[]> {
    try {
      const repo = this.getRepo(manager);
      const entities = repo.create(entity as DeepPartial<AddressesEntity>[]);
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
    console.log('🚀 ~ AddressRepository ~ GetPage ~ :');
    try {
      const page = Number(filterObj?.page ?? 1);
      const limit = Number(filterObj?.limit ?? 10);
      const skip = (page - 1) * limit;
      const orderby = filterObj?.orderby;
      const entity = 'addresses';
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
