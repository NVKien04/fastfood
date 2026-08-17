import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToCartDto, UpdateCartItemDto } from '@/modules/cart/presentation/dto';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';
import { Cart } from '@/modules/cart/domain/entities/cart.domain';
import { type ICartRepository } from '@/modules/cart/domain/repositories/cart.repository.interface';
import {
  CartItemsEntity,
  CartItemIngredientsEntity,
  ProductEntity,
  ProductVariantsEntity,
  IngredientsEntity,
} from '@/entities';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,
    @InjectRepository(CartItemsEntity)
    private readonly cartItemRepository: Repository<CartItemsEntity>,
    @InjectRepository(CartItemIngredientsEntity)
    private readonly cartItemIngredientRepository: Repository<CartItemIngredientsEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductVariantsEntity)
    private readonly productVariantRepository: Repository<ProductVariantsEntity>,
    @InjectRepository(IngredientsEntity)
    private readonly ingredientRepository: Repository<IngredientsEntity>,
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

    const product = await this.productRepository.findOne({
      where: { id: dto.productId, isActive: 1 },
    });

    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }

    let variant: ProductVariantsEntity | null = null;
    let variantPriceOffset = 0;
    if (dto.productVariantId) {
      variant = await this.productVariantRepository.findOne({
        where: { id: dto.productVariantId, isActive: 1 },
      });
      if (variant) {
        variantPriceOffset = variant.modifiedPrice || 0;
      }
    }

    const validIngredients: { ingredient: IngredientsEntity; quantity: number }[] = [];
    let ingredientsPriceTotal = 0;

    if (dto.ingredients && dto.ingredients.length > 0) {
      for (const ingDto of dto.ingredients) {
        const ing = await this.ingredientRepository.findOne({
          where: { id: ingDto.ingredientId, isActive: 1 },
        });
        if (ing) {
          const qty = ingDto.quantity || 1;
          ingredientsPriceTotal += (ing.price || 0) * qty;
          validIngredients.push({ ingredient: ing, quantity: qty });
        }
      }
    }

    const unitPrice = product.basePrice + variantPriceOffset + ingredientsPriceTotal;
    const targetIngIds = validIngredients.map((i) => i.ingredient.id).sort((a, b) => a - b);

    let existingItem: CartItemsEntity | null = null;

    if (cart.cartItems && cart.cartItems.length > 0) {
      for (const item of cart.cartItems) {
        if (item.productId === dto.productId && item.productVariantId === (dto.productVariantId || null)) {
          const itemIngIds = (item.cartItemIngredients || []).map((i) => i.ingredientId).sort((a, b) => a - b);

          if (targetIngIds.length === itemIngIds.length && targetIngIds.every((id, idx) => id === itemIngIds[idx])) {
            existingItem = item;
            break;
          }
        }
      }
    }

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      existingItem.price = unitPrice;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId: product.id,
        productVariantId: variant ? variant.id : null,
        quantity: dto.quantity,
        price: unitPrice,
      });

      const savedItem = await this.cartItemRepository.save(newItem);

      for (const ing of validIngredients) {
        const cartIng = this.cartItemIngredientRepository.create({
          cartItemId: savedItem.id,
          ingredientId: ing.ingredient.id,
          quantity: ing.quantity,
        });
        await this.cartItemIngredientRepository.save(cartIng);
      }
    }

    await this.recalculateCart(cart.id);
    return this.getCart(userId);
  }

  /**
   * Cập nhật số lượng của một món trong giỏ
   */
  async updateCartItemQuantity(userId: string, cartItemId: string, dto: UpdateCartItemDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cartId: cart.id },
    });

    if (!item) {
      throw new BusinessException(ErrorEnum.VALIDATION_ERROR);
    }

    if (dto.quantity <= 0) {
      await this.cartItemIngredientRepository.delete({ cartItemId: item.id });
      await this.cartItemRepository.delete({ id: item.id });
    } else {
      item.quantity = dto.quantity;
      await this.cartItemRepository.save(item);
    }

    await this.recalculateCart(cart.id);
    return this.getCart(userId);
  }

  /**
   * Xóa một món ra khỏi giỏ hàng
   */
  async removeCartItem(userId: string, cartItemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cartId: cart.id },
    });

    if (item) {
      await this.cartItemIngredientRepository.delete({ cartItemId: item.id });
      await this.cartItemRepository.delete({ id: item.id });
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
    const items = await this.cartItemRepository.find({
      where: { cartId },
    });

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
