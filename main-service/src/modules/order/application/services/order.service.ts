import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrdersEntity } from '@/entities/orders.entity';
import { OrderItemsEntity } from '@/entities/order-items.entity';
import { OrderItemsIngredientsEntity } from '@/entities/order-item-ingredients.entity';
import { ProductEntity } from '@/entities/product.entity';
import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { IngredientsEntity } from '@/entities/ingredients.entity';
import { CreateOrderDto } from '../../presentation/dto/create-order.dto';
import { OrderFilterDto } from '../../presentation/dto/order-filter.dto';
import { OrderStatus } from '@/enums/order-status.enum';
import { PaymentStatus } from '@/enums/payment-status.enum';
import { PaymentMethod } from '@/enums/payment-method.enum';
import { BusinessException } from '@/common/exception/biz.exception';
import { ErrorEnum } from '@/common/constants/error-code.constant';
import { PaginationResponse } from '@/common/core/pagination';
import { Order } from '../../domain/entities/order.domain';
import type { IOrderRepository } from '../../domain/repositories/order.repository.interface';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @InjectRepository(OrdersEntity)
    private readonly orderOrmRepository: Repository<OrdersEntity>,
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemRepository: Repository<OrderItemsEntity>,
    @InjectRepository(OrderItemsIngredientsEntity)
    private readonly orderItemIngredientRepository: Repository<OrderItemsIngredientsEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductVariantsEntity)
    private readonly productVariantRepository: Repository<ProductVariantsEntity>,
    @InjectRepository(IngredientsEntity)
    private readonly ingredientRepository: Repository<IngredientsEntity>,
  ) {}

  /**
   * Tạo đơn hàng mới trong một Database Transaction duy nhất
   */
  async createOrder(dto: CreateOrderDto, userId?: string): Promise<OrdersEntity> {
    if (!dto.items || dto.items.length === 0) {
      throw new BusinessException(ErrorEnum.CART_EMPTY);
    }

    return await this.dataSource.transaction(async (manager) => {
      let subTotal = 0;
      const preparedItems: {
        product: ProductEntity;
        variant?: ProductVariantsEntity | null;
        ingredients: { ingredient: IngredientsEntity; quantity: number }[];
        quantity: number;
        itemPrice: number;
      }[] = [];

      for (const itemDto of dto.items) {
        const product = await manager.findOne(ProductEntity, {
          where: { id: itemDto.productId, isActive: 1 },
        });

        if (!product) {
          throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
        }

        let variant: ProductVariantsEntity | null = null;
        let variantPriceOffset = 0;
        if (itemDto.productVariantId) {
          variant = await manager.findOne(ProductVariantsEntity, {
            where: { id: itemDto.productVariantId, isActive: 1 },
          });
          if (variant) {
            variantPriceOffset = variant.modifiedPrice || 0;
          }
        }

        const itemIngredients: { ingredient: IngredientsEntity; quantity: number }[] = [];
        let ingredientsPriceTotal = 0;

        if (itemDto.ingredients && itemDto.ingredients.length > 0) {
          for (const ingDto of itemDto.ingredients) {
            const ing = await manager.findOne(IngredientsEntity, {
              where: { id: ingDto.ingredientId, isActive: 1 },
            });
            if (ing) {
              const ingQty = ingDto.quantity || 1;
              ingredientsPriceTotal += (ing.price || 0) * ingQty;
              itemIngredients.push({ ingredient: ing, quantity: ingQty });
            }
          }
        }

        const singleUnitBasePrice = product.basePrice + variantPriceOffset + ingredientsPriceTotal;
        const totalItemPrice = singleUnitBasePrice * itemDto.quantity;
        subTotal += totalItemPrice;

        preparedItems.push({
          product,
          variant,
          ingredients: itemIngredients,
          quantity: itemDto.quantity,
          itemPrice: singleUnitBasePrice,
        });
      }

      const deliveryFee = 15000; // Phí ship cố định 15,000 VND
      const discount = 0;
      const total = subTotal + deliveryFee - discount;

      const orderNumber = `FF-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const orderEntity = manager.create(OrdersEntity, {
        orderNumber,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: dto.paymentMethod || PaymentMethod.COD,
        subTotal,
        deliveryFee,
        discount,
        total,
        notes: dto.notes,
        userId: userId || null,
        addressId: dto.addressId || null,
        guestName: dto.guestName || null,
        guestPhone: dto.guestPhone || null,
        guestAddress: dto.guestAddress || null,
      });

      const savedOrder = await manager.save(OrdersEntity, orderEntity);

      for (const prepItem of preparedItems) {
        const orderItem = manager.create(OrderItemsEntity, {
          orderId: savedOrder.id,
          productId: prepItem.product.id,
          productVariantId: prepItem.variant ? prepItem.variant.id : null,
          quantity: prepItem.quantity,
          price: prepItem.itemPrice,
        });

        const savedOrderItem = await manager.save(OrderItemsEntity, orderItem);

        for (const prepIng of prepItem.ingredients) {
          const itemIng = manager.create(OrderItemsIngredientsEntity, {
            orderItemId: savedOrderItem.id,
            ingredientId: prepIng.ingredient.id,
            quantity: prepIng.quantity,
          });
          await manager.save(OrderItemsIngredientsEntity, itemIng);
        }
      }

      this.logger.log(`✅ Created Order #${savedOrder.orderNumber} successfully!`);
      return savedOrder;
    });
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
