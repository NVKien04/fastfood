import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { CouponController } from './presentation/controllers/coupon.controller';
import { CouponService } from './application/services/coupon.service';
import { CouponTypeOrmRepository } from './infrastructure/repositories/coupon.typeorm.repository';
import { OrdersEntity } from '#src/entities/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CouponsEntity, OrdersEntity])],
  controllers: [CouponController],
  providers: [
    CouponService,
    {
      provide: 'ICouponRepository',
      useClass: CouponTypeOrmRepository,
    },
  ],
  exports: [CouponService],
})
export class CouponModule {}
