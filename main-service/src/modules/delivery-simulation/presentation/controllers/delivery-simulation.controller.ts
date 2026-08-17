import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators';
import { RoleEnum } from '@/enums';
import { DeliverySimulationService } from '@/modules/delivery-simulation/application/services/delivery-simulation.service';
import { SimulateDeliveryDto } from '@/modules/delivery-simulation/presentation/dto';

@ApiTags('Delivery Simulation')
@Controller('delivery-simulation')
export class DeliverySimulationController {
  constructor(private readonly deliverySimulationService: DeliverySimulationService) {}

  @Post(':orderId/simulate')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Giả lập tiến trình giao hàng tự động (Admin - chỉ dùng cho test)',
    description:
      'Tự động chuyển đơn hàng qua các trạng thái CONFIRMED → PREPARING → READY_FOR_SHIPMENT → DELIVERED ' +
      'với khoảng thời gian delay cấu hình giữa mỗi bước (mặc định 5 giây). Chạy trong background.',
  })
  @ApiResponse({ status: 200, description: 'Đã bắt đầu giả lập giao hàng' })
  async simulateDelivery(@Param('orderId') orderId: string, @Body() dto: SimulateDeliveryDto) {
    return await this.deliverySimulationService.simulateDelivery(orderId, dto.stepDelaySeconds);
  }
}
