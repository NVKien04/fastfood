import {
  IsInt,
  Min,
  Max,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  // nếu mỗi order chỉ được review 1 lần
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
