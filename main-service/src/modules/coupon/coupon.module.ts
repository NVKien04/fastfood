import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CouponsRepository } from './repository/coupon.repository';
import { OrdersEntity } from '#src/entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CouponsEntity, OrdersEntity])],
  controllers: [CouponController],
  providers: [
    CouponService,
    {
      provide: 'ICouponRepository',
      useClass: CouponsRepository,
    },
  ],
  exports: [CouponService],
})
export class CouponModule {}
