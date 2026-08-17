import { CouponsEntity, UserCouponsEntity } from '@/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserCouponsEntity, CouponsEntity])],
  exports: [TypeOrmModule],
})
export class UserCouponModule {}
