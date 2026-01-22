import { CouponsEntity } from '#src/entities/coupons.entity';
import { UserCouponsEntity } from '#src/entities/user-coupons.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserCouponsEntity, CouponsEntity])],
  exports: [TypeOrmModule],
})
export class UserCouponModule {}
