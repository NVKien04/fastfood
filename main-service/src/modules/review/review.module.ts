import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '#src/entities/reviews.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewTypeOrmRepository } from './infrastructure/review.typeorm.repository';
import { UserEntity } from '#src/entities/user.entity';
import { ProductEntity } from '#src/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, UserEntity, ProductEntity])],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    {
      provide: 'IReviewRepository',
      useClass: ReviewTypeOrmRepository,
    },
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
