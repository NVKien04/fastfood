import { PaginationResponse } from '#src/common/core/paganation';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IReviewRepository } from '#src/repositories/review/review.repository.interface';
import { CreateReviewDto } from '#src/dtos/review/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<any> {
    const { rating, comment, productId, orderId } = createReviewDto;

    const order = '';
    if (!order) {
      throw new NotFoundException('Order not found or already reviewed');
    }

    const alreadyReviewed = await this.reviewRepository.findOne({
      orderId: orderId,
    });

    if (alreadyReviewed) {
      throw new NotFoundException('Order already reviewed');
    }

    return this.reviewRepository.create(createReviewDto);
  }

  async getPage(FilterObject: any): Promise<PaginationResponse<any>> {
    return this.reviewRepository.GetPage(FilterObject);
  }
}
