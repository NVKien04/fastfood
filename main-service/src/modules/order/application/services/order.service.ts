import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/enums';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';
import { PaginationResponse } from '@/common/core';
import { Order, OrderItem, OrderItemIngredient } from '@/modules/order/domain/entities/order.domain';
import { type IOrderRepository } from '@/modules/order/domain/repositories/order.repository.interface';
import { ProductService } from '@/modules/product/application/services/product.service';
import { ProductVariantService } from '@/modules/product-variant/application/services/product-variant.service';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';
import { CouponService } from '@/modules/coupon/application/services/coupon.service';
import { CreateOrderDto, OrderFilterDto } from '@/modules/order/presentation/dto';

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

  /**
   * Tạo đơn hàng mới từ dữ liệu giỏ hàng, địa chỉ và mã giảm giá nhận từ Client
   * Tự động xác thực sản phẩm, biến thể, topping, voucher và tính toán lại giá tiền chuẩn xác.
   */
  async createOrder(dto: CreateOrderDto, userId?: string): Promise<Order> {
    if (!dto.items || dto.items.length === 0) {
      throw new BusinessException(ErrorEnum.CART_EMPTY);
    }

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

  /**
   * Lấy lịch sử đơn hàng của người dùng đang đăng nhập
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }
    return order;
  }

  /**
   * Lấy danh sách đơn hàng phân trang (Admin)
   */
  async getOrdersPage(filter: OrderFilterDto): Promise<PaginationResponse<Order>> {
    return this.orderRepository.findPaginated(filter);
  }

  /**
   * Cập nhật trạng thái đơn hàng (Admin / Shipper)
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.updateStatus(id, status);
    if (!order) {
      throw new BusinessException(ErrorEnum.ORDER_NOT_FOUND);
    }
    return order;
  }
}
