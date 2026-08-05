import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { CreateReviewDto } from '#src/modules/review/dto/create-review.dto';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

import { Review } from './domain/review.domain';
import type { IReviewRepository } from './domain/review.repository.interface';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async findOne(condition: Partial<Review>): Promise<Review | null> {
    return this.reviewRepository.findOne(condition);
  }

  async save(entity: Partial<Review>): Promise<Review> {
    return this.reviewRepository.create(entity);
  }

  async findPaginated(options: any, where?: Record<string, any>): Promise<[Review[], number]> {
    return this.reviewRepository.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const { orderId } = createReviewDto;

    const order = '';
    if (!order) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND_OR_REVIEWED);
    }

    const alreadyReviewed = await this.findOne({
      orderId: orderId,
    });

    if (alreadyReviewed) {
      throw new BusinessException(ErrorEnum.REVIEW_ALREADY_EXISTS);
    }

    return this.save(createReviewDto);
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }
}
