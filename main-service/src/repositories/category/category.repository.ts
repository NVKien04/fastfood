import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../base/base.repository';
import { CategoryEntity } from 'src/entities/category.entity';
import { ICategoryRepository } from './category.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { filterObj } from 'src/common/core/filterObj';
import { PaginationResponse } from 'src/common/core/paganation';

@Injectable()
export class CategoryRepository
  extends BaseRepository<CategoryEntity>
  implements ICategoryRepository
{
  constructor(
    @InjectRepository(CategoryEntity) repo: Repository<CategoryEntity>,
    private DataSource: DataSource,
  ) {
    super(repo);
  }

  async GetPage(filterObj: filterObj): Promise<PaginationResponse<any>> {
    console.log('🚀 ~ UserRepository ~ GetPage ~ :');

    try {
      const page = Number(filterObj.page) || 1;
      const limit = Number(filterObj.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = filterObj.fillter;
      const orderby = filterObj?.orderby;
      let entity = 'category';
      let relatedFields = [];
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

      if (orderby)
        qb.take(limit).skip(skip).orderBy(`${entity}.${orderby}`, 'ASC');
      else qb.take(limit).skip(skip);

      // BaseFilterService.applyResourceFilter(qb, userScope, {
      //   bo_nganh_id: `${entity}.id`,
      // });

      const [data, totalItems] = await qb.getManyAndCount();
      // xử lý respone có thể thay data =dataDto
      // const dataDto = plainToInstance(NhomtieuChiResponeDto, data, {
      //   // optional: chỉ convert những field có @Expose
      //   excludeExtraneousValues: false,
      // });
      const totalPages = Math.ceil(totalItems / limit);
      const itemCount = data.length;

      return {
        data: data,
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
