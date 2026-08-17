import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators/auth.decorator';
import { GetUser } from '@/common/decorators/getUser.decorator';
import type { AuthUser } from '@/modules/auth/domain/interface/auth.interface';
import { RoleEnum } from '@/enums/role.enum';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderFilterDto } from '../dto/order-filter.dto';
import { OrderStatus } from '@/enums/order-status.enum';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (Hỗ trợ cả người dùng đăng nhập & vãng lai)' })
  @ApiResponse({ status: 201, description: 'Tạo đơn hàng thành công' })
  async createOrder(@Body() dto: CreateOrderDto, @GetUser() user?: AuthUser) {
    const userId = user?.userId;
    const order = await this.orderService.createOrder(dto, userId);
    return {
      data: order,
      message: 'Đặt hàng thành công!',
    };
  }

  @Get('my-orders')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng cá nhân' })
  @ApiResponse({ status: 200, description: 'Lấy lịch sử đơn hàng thành công' })
  async getMyOrders(@GetUser() user: AuthUser) {
    const orders = await this.orderService.getUserOrders(user.userId);
    return {
      data: orders,
    };
  }

  @Post('get-page')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng phân trang (Admin)' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  async getOrdersPage(@Body() filter: OrderFilterDto) {
    return await this.orderService.getOrdersPage(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo ID' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  async getOrderById(@Param('id') id: string) {
    const order = await this.orderService.getOrderById(id);
    return {
      data: order,
    };
  }

  @Patch(':id/status')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Admin / Shipper)' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    const order = await this.orderService.updateOrderStatus(id, status);
    return {
      data: order,
      message: 'Cập nhật trạng thái đơn hàng thành công',
    };
  }
}
