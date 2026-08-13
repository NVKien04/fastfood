import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '@/entities/reviews.entity';
import { ReviewController } from '@/modules/review/presentation/controllers/review.controller';
import { ReviewService } from '@/modules/review/application/services/review.service';
import { ReviewTypeOrmRepository } from '@/modules/review/infrastructure/repositories/review.typeorm.repository';
import { UserEntity } from '@/entities/user.entity';
import { ProductEntity } from '@/entities/product.entity';

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
