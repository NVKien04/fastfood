import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { CreateCouponDto } from '#src/modules/coupon/dto/create-coupon.dto';
import { UpdateCouponDto } from '#src/modules/coupon/dto/update-coupon.dto';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { Inject, Injectable } from '@nestjs/common';
import type { ICouponRepository } from '#src/modules/coupon/repository/coupon.repository.interface';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

@Injectable()
export class CouponService {
  constructor(
    @Inject('ICouponRepository')
    private readonly couponRepository: ICouponRepository,
  ) {}

  async create(data: CreateCouponDto): Promise<CouponsEntity> {
    return this.couponRepository.create(data);
  }

  async getById(id: string): Promise<CouponsEntity | null> {
    return this.couponRepository.findById(id);
  }

  async update(id: string, data: UpdateCouponDto): Promise<CouponsEntity | null> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new BusinessException(ErrorEnum.COUPON_NOT_FOUND);
    }
    return this.couponRepository.update(id, data);
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.couponRepository.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async delete(id: string) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new BusinessException(ErrorEnum.COUPON_NOT_FOUND);
    }
    return this.couponRepository.softDelete(id);
  }
}
