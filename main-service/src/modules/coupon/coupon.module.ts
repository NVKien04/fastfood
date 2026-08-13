import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsEntity } from '@/entities/coupons.entity';
import { CouponController } from '@/modules/coupon/presentation/controllers/coupon.controller';
import { CouponService } from '@/modules/coupon/application/services/coupon.service';
import { CouponTypeOrmRepository } from '@/modules/coupon/infrastructure/repositories/coupon.typeorm.repository';
import { OrdersEntity } from '@/entities/orders.entity';

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
