import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderStatus } from '@/enums';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';
import { type IOrderRepository } from '@/modules/order/domain/repositories/order.repository.interface';

/**
 * Luồng mô phỏng giao hàng tự động (simulation).
 */
const DELIVERY_FLOW: OrderStatus[] = [
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY_FOR_SHIPMENT,
  OrderStatus.DELIVERED,
];

@Injectable()
export class DeliverySimulationService {
  private readonly logger = new Logger(DeliverySimulationService.name);

  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  /**
   * Giả lập tiến trình giao hàng tự động.
   * Chuyển đơn hàng tuần tự qua các trạng thái: CONFIRMED → PREPARING → READY_FOR_SHIPMENT → DELIVERED
   * với khoảng thời gian delay cấu hình giữa mỗi bước.
   *
   * Chạy trong background (fire-and-forget), trả về ngay để không block request.
   */
  async simulateDelivery(orderId: string, stepDelaySeconds = 5): Promise<{ message: string }> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BusinessException(ErrorEnum.ORDER_INVALID_STATUS_TRANSITION);
    }

    // Fire-and-forget: chạy trong background
    this.runDeliverySimulation(orderId, order.orderNumber, stepDelaySeconds).catch((err: unknown) => {
      this.logger.error(`❌ Delivery simulation failed for Order #${order.orderNumber}:`, err);
    });

    return {
      message: `Đã bắt đầu giả lập giao hàng cho đơn #${order.orderNumber}. Mỗi bước cách nhau ${stepDelaySeconds}s.`,
    };
  }

  /**
   * Chạy giả lập giao hàng tuần tự trong background.
   */
  private async runDeliverySimulation(orderId: string, orderNumber: string, stepDelaySeconds: number): Promise<void> {
    const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

    for (const nextStatus of DELIVERY_FLOW) {
      await delay(stepDelaySeconds * 1000);

      // Kiểm tra đơn hàng vẫn còn hợp lệ (chưa bị hủy giữa chừng)
      const currentOrder = await this.orderRepository.findById(orderId);
      if (!currentOrder || currentOrder.status === OrderStatus.CANCELLED) {
        this.logger.warn(`⚠️ Delivery simulation stopped for Order #${orderNumber}: order was cancelled`);
        return;
      }

      await this.orderRepository.updateStatus(orderId, nextStatus);
      this.logger.log(`🚚 [Simulation] Order #${orderNumber}: → ${nextStatus}`);
    }

    this.logger.log(`✅ [Simulation] Order #${orderNumber}: Delivery completed!`);
  }
}
