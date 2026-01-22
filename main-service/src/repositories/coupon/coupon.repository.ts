import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../base/base.repository';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationResponse } from 'src/common/core/paganation';

import { CouponsEntity } from '#src/entities/coupons.entity';
import { ICouponRepository } from './coupon.repository.interface';

@Injectable()
export class CouponsRepository
  extends BaseRepository<CouponsEntity>
  implements ICouponRepository
{
  constructor(
    @InjectRepository(CouponsEntity) repo: Repository<CouponsEntity>,
    private DataSource: DataSource,
  ) {
    super(repo);
  }

  async GetPage(filterObj?: any): Promise<PaginationResponse<any>> {
    console.log('🚀 ~ CategoryRepository ~ GetPage ~ :');

    try {
      const page = Number(filterObj?.page ?? 1);
      const limit = Number(filterObj?.limit ?? 10);
      const skip = (page - 1) * limit;
      const filter = filterObj?.fillter;
      const orderby = filterObj?.orderby;
      let entity = 'coupons';
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
