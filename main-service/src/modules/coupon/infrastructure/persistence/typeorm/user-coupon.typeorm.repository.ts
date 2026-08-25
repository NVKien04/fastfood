import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCouponsEntity } from '@/entities';
import {
  type IUserCouponRepository,
  type UserCouponInfo,
} from '@/modules/coupon/domain/repositories/user-coupon.repository.interface';

@Injectable()
export class UserCouponTypeOrmRepository implements IUserCouponRepository {
  constructor(
    @InjectRepository(UserCouponsEntity)
    private readonly repo: Repository<UserCouponsEntity>,
  ) {}

  async findByUserId(userId: string): Promise<UserCouponInfo[]> {
    const entities = await this.repo.find({
      where: { userId },
      relations: ['coupons_obj'],
      order: { createdAt: 'DESC' },
    });

    return entities.map((uc) => ({
      id: uc.id,
      isUsed: uc.isUsed,
      userId: uc.userId,
      couponsId: uc.couponsId,
      createdAt: uc.createdAt,
      updatedAt: uc.updatedAt,
      coupon: {
        id: uc.coupons_obj.id,
        code: uc.coupons_obj.code,
        name: uc.coupons_obj.name,
        description: uc.coupons_obj.description,
        value: uc.coupons_obj.value,
        minOrderAmount: uc.coupons_obj.minOrderAmount,
        startDate: uc.coupons_obj.startDate,
        endDate: uc.coupons_obj.endDate,
        isActive: uc.coupons_obj.isActive,
      },
    }));
  }

  async markAsUsed(userId: string, couponId: string): Promise<boolean> {
    const result = await this.repo.update({ userId, couponsId: couponId }, { isUsed: 1, userdAt: new Date() });
    return Boolean(result.affected && result.affected > 0);
  }

  async isUsedByUser(userId: string, couponId: string): Promise<boolean> {
    const record = await this.repo.findOne({
      where: { userId, couponsId: couponId, isUsed: 1 },
    });
    return !!record;
  }
}
