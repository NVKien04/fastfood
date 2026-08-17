import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators';
import { ApplyCouponDto, CouponFilterDto, CreateCouponDto, UpdateCouponDto } from '@/modules/coupon/presentation/dto';
import { RoleEnum } from '@/enums';
import { CouponService } from '@/modules/coupon/application/services/coupon.service';

@ApiTags('Coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  // ==========================================
  // PUBLIC ENDPOINTS (GUEST & USER CHECKOUT)
  // ==========================================

  @Post('apply')
  @ApiOperation({ summary: 'Kiểm tra và áp dụng mã giảm giá khi thanh toán (Công khai)' })
  @ApiResponse({ status: 200, description: 'Áp dụng mã giảm giá thành công' })
  @ApiResponse({ status: 400, description: 'Mã không hợp lệ, hết hạn hoặc chưa đủ điều kiện' })
  async applyCoupon(@Body() dto: ApplyCouponDto) {
    const result = await this.couponService.validateAndCalculateDiscount(dto.code, dto.subTotal);
    return {
      data: {
        code: result.coupon.code,
        name: result.coupon.name,
        discount: result.discount,
        finalTotal: result.finalTotal,
      },
      message: 'Áp dụng mã giảm giá thành công',
    };
  }

  // ==========================================
  // ADMIN & CRUD ENDPOINTS
  // ==========================================

  @Post('get-page')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách mã giảm giá phân trang (Admin)' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  async getPage(@Body() filterObject: CouponFilterDto) {
    return await this.couponService.getPage(filterObject);
  }

  @Post()
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới mã giảm giá (Admin)' })
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
    return {
      data: coupon,
    };
  }

  @Patch(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật mã giảm giá (Admin)' })
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
  @ApiOperation({ summary: 'Xóa mã giảm giá (Admin)' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Mã giảm giá không tồn tại' })
  async delete(@Param('id') id: string) {
    await this.couponService.delete(id);
    return {
      message: 'Xóa mã giảm giá thành công',
    };
  }
}
