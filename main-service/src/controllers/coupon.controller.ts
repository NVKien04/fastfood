import { AddressService } from '#src/services/address.service';
import { CouponService } from '#src/services/coupon.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('get-page')
  async getPage(@Body() filterObject: any) {
    return await this.couponService.getPage(filterObject);
  }
}
