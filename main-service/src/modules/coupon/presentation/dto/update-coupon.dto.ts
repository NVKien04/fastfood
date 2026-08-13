import { PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from '@/modules/coupon/presentation/dto/create-coupon.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}
