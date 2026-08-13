import { CouponsEntity } from '@/entities/coupons.entity';
import { UserCouponsEntity } from '@/entities/user-coupons.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserCouponsEntity, CouponsEntity])],
  exports: [TypeOrmModule],
})
export class UserCouponModule {}
