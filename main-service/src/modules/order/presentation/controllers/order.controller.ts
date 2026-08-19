import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '@/common/decorators';
import { type AuthUser } from '@/modules/auth/domain/interface/auth.interface';
import { OrderStatus, RoleEnum } from '@/enums';
import { CancelOrderDto, CreateOrderDto, OrderFilterDto } from '@/modules/order/presentation/dto';
import {
  CancelOrderUseCase,
  CreateOrderUseCase,
  GetOrderDetailUseCase,
  GetOrdersPageUseCase,
  GetUserOrdersUseCase,
  UpdateOrderStatusUseCase,
} from '@/modules/order/application/use-cases';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
    private readonly getOrdersPageUseCase: GetOrdersPageUseCase,
    private readonly getOrderDetailUseCase: GetOrderDetailUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới (Hỗ trợ cả người dùng đăng nhập & vãng lai)' })
  @ApiResponse({ status: 201, description: 'Tạo đơn hàng thành công' })
  async createOrder(@Body() dto: CreateOrderDto, @GetUser() user?: AuthUser) {
    const userId = user?.userId;
    const order = await this.createOrderUseCase.execute(dto, userId);
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
    const orders = await this.getUserOrdersUseCase.execute(user.userId);
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
    return await this.getOrdersPageUseCase.execute(filter);
  }

  @Get(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo ID (kiểm tra quyền sở hữu)' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  async getOrderById(@Param('id') id: string, @GetUser() user: AuthUser) {
    const order = await this.getOrderDetailUseCase.execute(id, user);
    return {
      data: order,
    };
  }

  @Post(':id/cancel')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Khách hàng hủy đơn hàng (chỉ khi đơn ở trạng thái PENDING hoặc CONFIRMED)' })
  @ApiResponse({ status: 200, description: 'Hủy đơn hàng thành công' })
  async cancelOrder(@Param('id') id: string, @Body() dto: CancelOrderDto, @GetUser() user: AuthUser) {
    const order = await this.cancelOrderUseCase.execute(id, dto.reason, user);
    return {
      data: order,
      message: 'Hủy đơn hàng thành công',
    };
  }

  @Patch(':id/status')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Admin / Shipper) - áp dụng State Machine' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  async updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    const order = await this.updateOrderStatusUseCase.execute(id, status);
    return {
      data: order,
      message: 'Cập nhật trạng thái đơn hàng thành công',
    };
  }
}
