import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators/auth.decorator';
import { GetUser } from '@/common/decorators/getUser.decorator';
import type { AuthUser } from '@/common/constants/auth.constant';
import { CartService } from '../../application/services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Auth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy giỏ hàng chi tiết của người dùng đang đăng nhập' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin giỏ hàng thành công' })
  async getCart(@GetUser() user: AuthUser) {
    const cart = await this.cartService.getCart(user.userId);
    return {
      data: cart,
    };
  }

  @Post('items')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @ApiResponse({ status: 201, description: 'Thêm vào giỏ hàng thành công' })
  async addItem(@GetUser() user: AuthUser, @Body() dto: AddToCartDto) {
    const cart = await this.cartService.addItemToCart(user.userId, dto);
    return {
      data: cart,
      message: 'Đã thêm món vào giỏ hàng thành công',
    };
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Cập nhật số lượng của một món trong giỏ hàng' })
  @ApiResponse({ status: 200, description: 'Cập nhật số lượng thành công' })
  async updateQuantity(@GetUser() user: AuthUser, @Param('itemId') itemId: string, @Body() dto: UpdateCartItemDto) {
    const cart = await this.cartService.updateCartItemQuantity(user.userId, itemId, dto);
    return {
      data: cart,
      message: 'Cập nhật giỏ hàng thành công',
    };
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Xóa 1 món ra khỏi giỏ hàng' })
  @ApiResponse({ status: 200, description: 'Xóa món thành công' })
  async removeItem(@GetUser() user: AuthUser, @Param('itemId') itemId: string) {
    const cart = await this.cartService.removeCartItem(user.userId, itemId);
    return {
      data: cart,
      message: 'Đã xóa món ra khỏi giỏ hàng',
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa sạch toàn bộ giỏ hàng' })
  @ApiResponse({ status: 200, description: 'Xóa giỏ hàng thành công' })
  async clearCart(@GetUser() user: AuthUser) {
    const success = await this.cartService.clearCart(user.userId);
    return {
      success,
      message: 'Đã xóa toàn bộ giỏ hàng',
    };
  }
}
