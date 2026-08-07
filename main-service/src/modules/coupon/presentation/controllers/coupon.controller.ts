import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '#src/common/decorators/auth.decorator';
import type { filterObj } from '#src/common/core/filterObj';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { RoleEnum } from '#src/enums/role.enum';
import { CouponService } from '../../application/services/coupon.service';

@ApiTags('Coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('get-page')
  @ApiOperation({ summary: 'Lấy danh sách mã giảm giá phân trang' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  async getPage(@Body() filterObject: filterObj) {
    return await this.couponService.getPage(filterObject);
  }

  @Post()
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới mã giảm giá' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  async create(@Body() createCouponDto: CreateCouponDto) {
    const coupon = await this.couponService.create(createCouponDto);
    return {
      data: coupon,
      message: 'Tạo mã giảm giá thành công',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết mã giảm giá theo ID' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Mã giảm giá không tồn tại' })
  async getById(@Param('id') id: string) {
    const coupon = await this.couponService.getById(id);
    if (!coupon) {
      throw new NotFoundException('Mã giảm giá không tồn tại');
    }
    return {
      data: coupon,
    };
  }

  @Patch(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật mã giảm giá' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Mã giảm giá không tồn tại' })
  async update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponService.update(id, updateCouponDto);
    return {
      data: coupon,
      message: 'Cập nhật mã giảm giá thành công',
    };
  }

  @Delete(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa mã giảm giá' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Mã giảm giá không tồn tại' })
  async delete(@Param('id') id: string) {
    await this.couponService.delete(id);
    return {
      message: 'Xóa mã giảm giá thành công',
    };
  }
}
