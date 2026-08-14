import { buildPaginationResponse, PaginationResponse } from '@/common/core/pagination';
import { CreateCouponDto } from '@/modules/coupon/presentation/dto/create-coupon.dto';
import { UpdateCouponDto } from '@/modules/coupon/presentation/dto/update-coupon.dto';
import { CouponFilterDto } from '@/modules/coupon/presentation/dto/coupon-filter.dto';
import { Inject, Injectable } from '@nestjs/common';
import { BusinessException } from '@/common/exception/biz.exception';
import { ErrorEnum } from '@/common/constants/error-code.constant';

import { Coupon } from '@/modules/coupon/domain/entities/coupon.domain';
import type { ICouponRepository } from '@/modules/coupon/domain/repositories/coupon.repository.interface';

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

  async findByIdOrThrow(id: string): Promise<Coupon> {
    const coupon = await this.findById(id);
    if (!coupon) {
      throw new BusinessException(ErrorEnum.COUPON_NOT_FOUND);
    }
    return coupon;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return this.couponRepository.findByCode(code);
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

  async incrementUsage(id: string): Promise<boolean> {
    return this.couponRepository.incrementUsage(id);
  }

  async findPaginated(
    options: { skip: number; take: number; orderBy?: string; orderDirection?: 'ASC' | 'DESC' },
    where?: Record<string, unknown>,
  ): Promise<[Coupon[], number]> {
    return this.couponRepository.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  /**
   * Tạo mới mã giảm giá
   */
  async create(data: CreateCouponDto): Promise<Coupon> {
    const uppercaseCode = data.code.trim().toUpperCase();
    const existing = await this.findByCode(uppercaseCode);
    if (existing) {
      throw new BusinessException(ErrorEnum.VALIDATION_ERROR);
    }

    return this.save({
      ...data,
      code: uppercaseCode,
      currentUses: 0,
      isActive: data.isActive ?? 1,
    });
  }

  /**
   * Lấy chi tiết mã giảm giá theo ID
   */
  async getById(id: string): Promise<Coupon> {
    return this.findByIdOrThrow(id);
  }

  /**
   * Cập nhật mã giảm giá
   */
  async update(id: string, data: UpdateCouponDto): Promise<Coupon | null> {
    await this.findByIdOrThrow(id);

    const updatePayload: Partial<Coupon> = { ...data };
    if (data.code) {
      updatePayload.code = data.code.trim().toUpperCase();
    }

    return this.updateRaw(id, updatePayload);
  }

  /**
   * Lấy danh sách mã giảm giá phân trang (Admin)
   */
  async getPage(filterObject: CouponFilterDto): Promise<PaginationResponse<Coupon>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filterObject?.isActive !== undefined) {
      where['isActive'] = Number(filterObject.isActive);
    }

    const [data, totalItems] = await this.findPaginated(
      {
        skip,
        take: limit,
        orderBy: filterObject?.orderby,
      },
      where,
    );

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  /**
   * Xóa mã giảm giá
   */
  async delete(id: string): Promise<boolean> {
    await this.findByIdOrThrow(id);
    return this.softDeleteRaw(id);
  }

  /**
   * Kiểm tra tính hợp lệ và tính toán số tiền giảm giá của Coupon
   * Được gọi khi người dùng áp dụng mã giảm giá tại Checkout hoặc khi tạo đơn hàng
   */
  async validateAndCalculateDiscount(
    code: string,
    subTotal: number,
  ): Promise<{ coupon: Coupon; discount: number; finalTotal: number }> {
    const normalizedCode = code.trim().toUpperCase();
    const coupon = await this.findByCode(normalizedCode);

    if (!coupon || !coupon.isActive || coupon.isActive === 0) {
      throw new BusinessException(ErrorEnum.COUPON_NOT_FOUND);
    }

    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    // 1. Kiểm tra ngày bắt đầu
    if (now < startDate) {
      throw new BusinessException(ErrorEnum.COUPON_NOT_STARTED);
    }

    // 2. Kiểm tra ngày hết hạn
    if (now > endDate) {
      throw new BusinessException(ErrorEnum.COUPON_EXPIRED);
    }

    // 3. Kiểm tra số lượt sử dụng tối đa
    if (coupon.currentUses >= coupon.maxUser) {
      throw new BusinessException(ErrorEnum.COUPON_OUT_OF_USES);
    }

    // 4. Kiểm tra giá trị đơn hàng tối thiểu
    if (subTotal < coupon.minOrderAmount) {
      throw new BusinessException(ErrorEnum.COUPON_MIN_AMOUNT_NOT_REACHED);
    }

    // 5. Tính toán tiền giảm giá (không vượt quá subTotal)
    const discount = Math.min(coupon.value, subTotal);
    const finalTotal = Math.max(0, subTotal - discount);

    return {
      coupon,
      discount,
      finalTotal,
    };
  }
}
