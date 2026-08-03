import { buildPaginationResponse, PaginationResponse } from '#src/common/core/paganation';
import { Inject, Injectable } from '@nestjs/common';
import type { IReviewRepository } from '#src/modules/review/repository/review.repository.interface';
import { CreateReviewDto } from '#src/modules/review/dto/create-review.dto';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<any> {
    const { orderId } = createReviewDto;

    const order = '';
    if (!order) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND_OR_REVIEWED);
    }

    const alreadyReviewed = await this.reviewRepository.findOne({
      orderId: orderId,
    });

    if (alreadyReviewed) {
      throw new BusinessException(ErrorEnum.REVIEW_ALREADY_EXISTS);
    }

    return this.reviewRepository.create(createReviewDto);
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.reviewRepository.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }
}
