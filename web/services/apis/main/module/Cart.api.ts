import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../generated/http-client';
import { apiFormat } from '../../api';
import { BaseResponse } from '../../api.type';

export interface AddToCartIngredientPayload {
  ingredientId: number;
  quantity?: number;
}

export interface AddToCartPayload {
  productId: string;
  productVariantId?: number;
  ingredients?: AddToCartIngredientPayload[];
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CartIngredientResponseDto {
  id: string;
  ingredientId: number;
  quantity: number;
  ingredient_obj?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export interface CartItemResponseDto {
  id: string;
  productId?: string;
  productVariantId?: number;
  quantity: number;
  price?: number;
  product_obj?: {
    id: string;
    name: string;
    basePrice: number;
    description?: string;
  };
  productVariant_obj?: {
    id: number;
    name: string;
    size: string;
    type: string;
    modifiedPrice: number;
  };
  cartItemIngredients?: CartIngredientResponseDto[];
}

export interface CartResponseDto {
  id: string;
  userId: string;
  totalCartPrice: number;
  totalItemDiff: number;
  totalItems: number;
  cartItems?: CartItemResponseDto[];
}

export class CartApiModule {
  public http: HttpClient<string>;

  constructor(config: AxiosRequestConfig) {
    this.http = new HttpClient<string>({
      ...config,
    });
  }

  /**
   * Lấy thông tin giỏ hàng của người dùng từ Server
   */
  getCart = async (): Promise<BaseResponse<CartResponseDto>> => {
    try {
      const response = await this.http.instance.get('/api/cart');
      return apiFormat<CartResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error fetching cart';
      console.error('Error fetching cart:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Thêm món vào giỏ hàng Server
   */
  addItem = async (data: AddToCartPayload): Promise<BaseResponse<CartResponseDto>> => {
    try {
      const response = await this.http.instance.post('/api/cart/items', data);
      return apiFormat<CartResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error adding to cart';
      console.error('Error adding to cart:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật số lượng món trong giỏ Server
   */
  updateQuantity = async (itemId: string, data: UpdateCartItemPayload): Promise<BaseResponse<CartResponseDto>> => {
    try {
      const response = await this.http.instance.patch(`/api/cart/items/${itemId}`, data);
      return apiFormat<CartResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error updating cart item';
      console.error('Error updating cart item:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa 1 món khỏi giỏ Server
   */
  removeItem = async (itemId: string): Promise<BaseResponse<CartResponseDto>> => {
    try {
      const response = await this.http.instance.delete(`/api/cart/items/${itemId}`);
      return apiFormat<CartResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error removing cart item';
      console.error('Error removing cart item:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa toàn bộ giỏ Server
   */
  clearCart = async (): Promise<BaseResponse<unknown>> => {
    try {
      const response = await this.http.instance.delete('/api/cart');
      return apiFormat<unknown>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error clearing cart';
      console.error('Error clearing cart:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
