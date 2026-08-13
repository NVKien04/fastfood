import { ReviewService } from '@/modules/review/application/services/review.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('get-page')
  async getPage(@Body() filterObject: any) {
    return await this.reviewService.getPage(filterObject);
  }
}
