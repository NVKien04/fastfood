import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsEntity } from '#src/entities/coupons.entity';
import { CouponController } from '#src/controllers/coupon.controller';
import { CouponService } from '#src/services/coupon.service';
import { CouponsRepository } from '#src/repositories/coupon/coupon.repository';
import { ReviewEntity } from '#src/entities/reviews.entity';
import { ReviewController } from '#src/controllers/review.controller';
import { ReviewService } from '#src/services/review.service';
import { ReviewRepository } from '#src/repositories/review/review.repository';
import { OrderItemsEntity } from '#src/entities/order-items.entity';
import { UserEntity } from '#src/entities/user.entity';
import { ProductEntity } from '#src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, UserEntity, ProductEntity]),
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: 'IReviewRepository',
      useClass: ReviewRepository,
    },
  ],

  exports: [ReviewService],
})
export class ReviewModule {}
