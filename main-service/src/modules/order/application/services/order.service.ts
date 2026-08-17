import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/enums';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';
import { type PaginationResponse } from '@/common/core';
import { Order, OrderItem, OrderItemIngredient } from '@/modules/order/domain/entities/order.domain';
import { type IOrderRepository } from '@/modules/order/domain/repositories/order.repository.interface';
import { ProductService } from '@/modules/product/application/services/product.service';
import { ProductVariantService } from '@/modules/product-variant/application/services/product-variant.service';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';
import { CouponService } from '@/modules/coupon/application/services/coupon.service';
import { CreateOrderDto, OrderFilterDto } from '@/modules/order/presentation/dto';
import { type AuthUser } from '@/modules/auth/domain/interface/auth.interface';

/**
 * Bảng chuyển trạng thái hợp lệ cho đơn hàng (State Machine).
 * Key = trạng thái hiện tại, Value = danh sách trạng thái có thể chuyển đến.
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY_FOR_SHIPMENT],
  [OrderStatus.READY_FOR_SHIPMENT]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

const CANCELLABLE_STATUSES: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly productService: ProductService,
    private readonly productVariantService: ProductVariantService,
    private readonly ingredientService: IngredientService,
    private readonly couponService: CouponService,
  ) {}

  // =============================================
  // NHÓM 1: TẠO ĐƠN HÀNG
  // =============================================

  /**
   * Tạo đơn hàng mới từ dữ liệu giỏ hàng, địa chỉ và mã giảm giá nhận từ Client
   * Tự động xác thực sản phẩm, biến thể, topping, voucher và tính toán lại giá tiền chuẩn xác.
   */
  async createOrder(dto: CreateOrderDto, userId?: string): Promise<Order> {
    if (!dto.items || dto.items.length === 0) {
      throw new BusinessException(ErrorEnum.CART_EMPTY);
    }

    // Validate thông tin giao hàng cho khách vãng lai
    this.validateDeliveryInfo(dto, userId);

    let subTotal = 0;
    const preparedItems: OrderItem[] = [];

    for (const itemDto of dto.items) {
      // 1. Kiểm tra sản phẩm và trạng thái active
      const product = await this.productService.findByIdOrThrow(itemDto.productId);

      // 2. Kiểm tra biến thể (Size/Đế) nếu có
      let variantPriceOffset = 0;
      let variantName: string | undefined;
      if (itemDto.productVariantId) {
        const variants = await this.productVariantService.findByProductId(product.id);
        const variant = variants.find((v) => v.id === itemDto.productVariantId);
        if (variant) {
          variantPriceOffset = variant.modifiedPrice || 0;
          variantName = variant.name;
        }
      }

      // 3. Kiểm tra nguyên liệu / topping thêm nếu có
      const itemIngredients: OrderItemIngredient[] = [];
      let ingredientsPriceTotal = 0;

      if (itemDto.ingredients && itemDto.ingredients.length > 0) {
        for (const ingDto of itemDto.ingredients) {
          const ing = await this.ingredientService.findById(ingDto.ingredientId);
          if (ing) {
            const qty = ingDto.quantity || 1;
            const ingPrice = (ing.price || 0) * qty;
            ingredientsPriceTotal += ingPrice;
            itemIngredients.push({
              ingredientId: ing.id,
              quantity: qty,
              ingredientName: ing.name,
              ingredientPrice: ing.price,
            });
          }
        }
      }

      // 4. Tính đơn giá cho từng món (Base + Variant + Topping)
      const singleUnitPrice = product.basePrice + variantPriceOffset + ingredientsPriceTotal;
      const totalItemPrice = singleUnitPrice * itemDto.quantity;
      subTotal += totalItemPrice;

      preparedItems.push({
        productId: product.id,
        productVariantId: itemDto.productVariantId || null,
        quantity: itemDto.quantity,
        price: singleUnitPrice,
        productName: product.name,
        variantName,
        ingredients: itemIngredients,
      });
    }

    // 5. Kiểm tra và áp dụng mã giảm giá (nếu có)
    let discount = 0;
    let appliedCouponId: string | undefined;

    if (dto.couponCode) {
      const couponResult = await this.couponService.validateAndCalculateDiscount(dto.couponCode, subTotal);
      discount = couponResult.discount;
      appliedCouponId = couponResult.coupon.id;
    }

    const deliveryFee = 15000; // Phí ship mặc định 15,000 VND
    const total = Math.max(0, subTotal + deliveryFee - discount);

    const orderNumber = `FF-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderDomain: Order = {
      orderNumber,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: dto.paymentMethod || PaymentMethod.COD,
      subTotal,
      deliveryFee,
      discount,
      total,
      notes: dto.notes || null,
      userId: userId || null,
      addressId: dto.addressId || null,
      guestName: dto.guestName || null,
      guestPhone: dto.guestPhone || null,
      guestAddress: dto.guestAddress || null,
      orderItems: preparedItems,
    };

    const savedOrder = await this.orderRepository.saveOrder(orderDomain);

    // 6. Tăng số lượt sử dụng voucher thành công
    if (appliedCouponId) {
      await this.couponService.incrementUsage(appliedCouponId);
    }

    return savedOrder;
  }

  // =============================================
  // NHÓM 2: TRUY VẤN ĐƠN HÀNG
  // =============================================

  /**
   * Lấy lịch sử đơn hàng của người dùng đang đăng nhập
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  /**
   * Lấy chi tiết đơn hàng theo ID (có kiểm tra quyền truy cập).
   * - Người dùng đăng nhập: chỉ xem được đơn của chính mình.
   * - Admin: xem được tất cả đơn hàng.
   */
  async getOrderById(id: string, currentUser?: AuthUser): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }

    // Kiểm tra quyền truy cập
    if (currentUser) {
      this.assertOrderOwnership(order, currentUser);
    }

    return order;
  }

  /**
   * Lấy danh sách đơn hàng phân trang (Admin)
   */
  async getOrdersPage(filter: OrderFilterDto): Promise<PaginationResponse<Order>> {
    return this.orderRepository.findPaginated(filter);
  }

  // =============================================
  // NHÓM 3: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
  // =============================================

  /**
   * Cập nhật trạng thái đơn hàng (Admin / Shipper).
   * Áp dụng State Machine để validate luồng chuyển trạng thái hợp lệ.
   */
  async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }

    // Validate State Machine
    this.assertValidTransition(order.status, newStatus);

    const updated = await this.orderRepository.updateStatus(id, newStatus);
    if (!updated) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }

    this.logger.log(`📦 Order #${order.orderNumber}: ${order.status} → ${newStatus}`);
    return updated;
  }

  /**
   * Khách hàng hủy đơn hàng (chỉ cho phép khi đơn ở trạng thái PENDING hoặc CONFIRMED).
   */
  async cancelOrder(id: string, reason: string | undefined, currentUser: AuthUser): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }

    // Kiểm tra quyền sở hữu
    this.assertOrderOwnership(order, currentUser);

    // Kiểm tra trạng thái cho phép hủy
    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      throw new BusinessException(ErrorEnum.ORDER_CANNOT_CANCEL);
    }

    const cancelled = await this.orderRepository.cancelOrder(id, reason);
    if (!cancelled) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }

    this.logger.log(
      `❌ Order #${order.orderNumber} cancelled by user ${currentUser.userId}. Reason: ${reason || 'N/A'}`,
    );
    return cancelled;
  }

  // =============================================
  // PRIVATE HELPERS
  // =============================================

  /**
   * Validate thông tin giao hàng: nếu không có userId (khách vãng lai), bắt buộc phải có guestName, guestPhone, guestAddress.
   */
  private validateDeliveryInfo(dto: CreateOrderDto, userId?: string): void {
    if (!userId && (!dto.guestName || !dto.guestPhone || !dto.guestAddress)) {
      throw new BusinessException(ErrorEnum.ORDER_DELIVERY_INFO_REQUIRED);
    }
  }

  /**
   * Kiểm tra quyền sở hữu đơn hàng.
   * - Admin: được phép truy cập tất cả.
   * - User thường: chỉ truy cập đơn hàng do chính mình tạo.
   */
  private assertOrderOwnership(order: Order, currentUser: AuthUser): void {
    if (currentUser.role !== 'admin' && order.userId !== currentUser.userId) {
      throw new BusinessException(ErrorEnum.ORDER_ACCESS_DENIED);
    }
  }

  /**
   * Validate chuyển trạng thái đơn hàng theo State Machine.
   */
  private assertValidTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new BusinessException(ErrorEnum.ORDER_INVALID_STATUS_TRANSITION);
    }
  }
}
