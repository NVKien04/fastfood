import { UserEntity } from 'src/entities/user.entity';
import { IUserRepository } from './user.repository.interface';
import { BaseRepository } from '../base/base.repository';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { filterObj } from 'src/common/core/filterObj';
import { PaginationResponse } from 'src/common/core/paganation';
import { QueryBuilderUtils } from 'typeorm/query-builder/QueryBuilderUtils.js';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '#src/dtos/user/response-user.dto';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) repo: Repository<UserEntity>,
    private DataSource: DataSource,
  ) {
    super(repo);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async GetPage(filterObj: filterObj): Promise<PaginationResponse<any>> {
    console.log('🚀 ~ UserRepository ~ GetPage ~ :');
    console.log('🚀 ~ UserRepository ~ GetPage ~ filterObj:', filterObj);

    try {
      const page = Number(filterObj?.page ?? 1);
      const limit = Number(filterObj?.limit ?? 10);
      const skip = (page - 1) * limit;
      const filter = filterObj?.fillter;
      const orderby = filterObj?.orderby;
      const entity = 'users';
      const relatedFields = [];
      const qb = this.repo.createQueryBuilder(entity);
      // QueryBuilderUtils.applyFilters(qb, filter, entity);

      if (relatedFields.length > 0) {
        relatedFields.forEach((field: any) => {
          qb.leftJoin(`${entity}.${field.field}`, field.alias);
          if (field.select?.length) {
            const cols = field.select.map((c) => `${field.alias}.${c}`);
            qb.addSelect(cols);
          }
        });
      }

      if (orderby) qb.take(limit).skip(skip).orderBy(`${entity}.${orderby}`, 'ASC');
      else qb.take(limit).skip(skip);

      // BaseFilterService.applyResourceFilter(qb, userScope, {
      //   bo_nganh_id: `${entity}.id`,
      // });

      const [data, totalItems] = await qb.getManyAndCount();
      // xử lý respone có thể thay data =dataDto
      const dataDto = plainToInstance(UserResponseDto, data, {
        // optional: chỉ convert những field có @Expose
        excludeExtraneousValues: false,
      });
      const totalPages = Math.ceil(totalItems / limit);
      const itemCount = data.length;

      return {
        data: dataDto,
        meta: {
          totalItems,
          itemCount,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      };
    } catch (error: any) {
      console.error(`[DB ERROR] GetPage failed:`, error.message);
      throw new BadRequestException({
        message: 'Failed to fetch paged data',
        detail: error.message,
      });
    }
  }
}
