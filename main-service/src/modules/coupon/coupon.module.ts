import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsEntity, OrdersEntity, UserCouponsEntity } from '@/entities';
import { CouponController } from '@/modules/coupon/presentation/controllers/coupon.controller';
import { CouponService } from '@/modules/coupon/application/services/coupon.service';
import { CouponTypeOrmRepository } from '@/modules/coupon/infrastructure/persistence/typeorm/coupon.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CouponsEntity, OrdersEntity, UserCouponsEntity])],
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
