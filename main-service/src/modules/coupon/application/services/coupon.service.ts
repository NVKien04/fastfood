import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { CreateCouponDto } from '../../presentation/dto/create-coupon.dto';
import { UpdateCouponDto } from '../../presentation/dto/update-coupon.dto';
import { Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

import { Coupon } from '../../domain/entities/coupon.domain';
import type { ICouponRepository } from '../../domain/repositories/coupon.repository.interface';

@Injectable()
export class CouponService {
  constructor(
    @Inject('ICouponRepository')
    private readonly couponRepository: ICouponRepository,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async findById(id: string): Promise<Coupon | null> {
    return this.couponRepository.findById(id);
  }

  async findOne(condition: Partial<Coupon>): Promise<Coupon | null> {
    return this.couponRepository.findOne(condition);
  }

  async findAll(
    condition?: Partial<Coupon>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Coupon[]> {
    return this.couponRepository.findAll(condition, order, relations);
  }

  async save(entity: Partial<Coupon>): Promise<Coupon> {
    return this.couponRepository.create(entity);
  }

  async updateRaw(id: string, entity: Partial<Coupon>): Promise<Coupon | null> {
    return this.couponRepository.update(id, entity);
  }

  async softDeleteRaw(id: string): Promise<boolean> {
    return this.couponRepository.softDelete(id);
  }

  async findPaginated(options: any, where?: Record<string, any>): Promise<[Coupon[], number]> {
    return this.couponRepository.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async create(data: CreateCouponDto): Promise<Coupon> {
    return this.save(data);
  }

  async getById(id: string): Promise<Coupon | null> {
    return this.findById(id);
  }

  async update(id: string, data: UpdateCouponDto): Promise<Coupon | null> {
    const coupon = await this.findById(id);
    if (!coupon) {
      throw new BusinessException(ErrorEnum.COUPON_NOT_FOUND);
    }
    return this.updateRaw(id, data);
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async delete(id: string) {
    const coupon = await this.findById(id);
    if (!coupon) {
      throw new BusinessException(ErrorEnum.COUPON_NOT_FOUND);
    }
    return this.softDeleteRaw(id);
  }
}
