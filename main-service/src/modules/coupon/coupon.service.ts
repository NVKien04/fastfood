import { filterObj } from '#src/common/core/filterObj';
import { PaginationResponse } from '#src/common/core/paganation';
import { CreateCouponDto } from '#src/modules/coupon/dto/create-coupon.dto';
import { UpdateCouponDto } from '#src/modules/coupon/dto/update-coupon.dto';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICouponRepository } from '#src/modules/coupon/repository/coupon.repository.interface';

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
      throw new NotFoundException('Mã giảm giá không tồn tại');
    }
    return this.couponRepository.update(id, data);
  }

  async getPage(FilterObject: filterObj): Promise<PaginationResponse<any>> {
    return this.couponRepository.GetPage(FilterObject);
  }

  async delete(id: string) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Mã giảm giá không tồn tại');
    }
    return this.couponRepository.softDelete(id);
  }
}
