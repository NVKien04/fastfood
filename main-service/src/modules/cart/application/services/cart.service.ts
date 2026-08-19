import { Inject, Injectable, Logger } from '@nestjs/common';
import { AddToCartDto, UpdateCartItemDto } from '@/modules/cart/presentation/dto';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';
import { Cart } from '@/modules/cart/domain/entities/cart.domain';
import { type ICartRepository } from '@/modules/cart/domain/repositories/cart.repository.interface';
import { ProductService } from '@/modules/product/application/services/product.service';
import { ProductVariantService } from '@/modules/product-variant/application/services/product-variant.service';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,
    private readonly productService: ProductService,
    private readonly productVariantService: ProductVariantService,
    private readonly ingredientService: IngredientService,
  ) {}

  /**
   * Lấy hoặc tạo mới giỏ hàng cho người dùng
   */
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }
    return cart;
  }

  /**
   * Lấy giỏ hàng chi tiết của người dùng
   */
  async getCart(userId: string): Promise<Cart> {
    return this.getOrCreateCart(userId);
  }

  /**
   * Thêm sản phẩm vào giỏ hàng (Tự động cộng gộp số lượng nếu trùng món + biến thể + topping)
   */
  async addItemToCart(userId: string, dto: AddToCartDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const product = await this.productService.findOne({ id: dto.productId, isActive: 1 });
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }

    let variantPriceOffset = 0;
    if (dto.productVariantId) {
      const variants = await this.productVariantService.findByProductId(product.id);
      const variant = variants.find(
        (productVariant) => productVariant.id === dto.productVariantId && productVariant.isActive === 1,
      );
      if (variant) {
        variantPriceOffset = variant.modifiedPrice || 0;
      }
    }

    const validIngredients: { ingredientId: number; quantity: number }[] = [];
    let ingredientsPriceTotal = 0;

    if (dto.ingredients && dto.ingredients.length > 0) {
      for (const ingDto of dto.ingredients) {
        const ing = await this.ingredientService.findOne({ id: ingDto.ingredientId, isActive: 1 });
        if (ing) {
          const qty = ingDto.quantity || 1;
          ingredientsPriceTotal += (ing.price || 0) * qty;
          validIngredients.push({ ingredientId: ing.id, quantity: qty });
        }
      }
    }

    const unitPrice = product.basePrice + variantPriceOffset + ingredientsPriceTotal;
    await this.cartRepository.addItem(cart.id, {
      productId: product.id,
      productVariantId: dto.productVariantId ?? null,
      quantity: dto.quantity,
      price: unitPrice,
      ingredients: validIngredients,
    });

    await this.recalculateCart(cart.id);
    return this.getCart(userId);
  }

  /**
   * Cập nhật số lượng của một món trong giỏ
   */
  async updateCartItemQuantity(userId: string, cartItemId: string, dto: UpdateCartItemDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.cartRepository.findItemById(cart.id, cartItemId);

    if (!item) {
      throw new BusinessException(ErrorEnum.VALIDATION_ERROR);
    }

    if (dto.quantity <= 0) {
      await this.cartRepository.removeItem(item.id);
    } else {
      await this.cartRepository.updateItemQuantity(item.id, dto.quantity);
    }

    await this.recalculateCart(cart.id);
    return this.getCart(userId);
  }

  /**
   * Xóa một món ra khỏi giỏ hàng
   */
  async removeCartItem(userId: string, cartItemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.cartRepository.findItemById(cart.id, cartItemId);

    if (item) {
      await this.cartRepository.removeItem(item.id);
      await this.recalculateCart(cart.id);
    }

    return this.getCart(userId);
  }

  /**
   * Xóa toàn bộ giỏ hàng
   */
  async clearCart(userId: string): Promise<boolean> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartRepository.clearCartItems(cart.id);
    return true;
  }

  private async recalculateCart(cartId: string): Promise<void> {
    const items = await this.cartRepository.findItemsByCartId(cartId);

    let totalCartPrice = 0;
    let totalItems = 0;
    const totalItemDiff = items.length;

    for (const item of items) {
      totalCartPrice += (item.price || 0) * item.quantity;
      totalItems += item.quantity;
    }

    await this.cartRepository.updateCartTotals(cartId, totalCartPrice, totalItemDiff, totalItems);
  }
}
