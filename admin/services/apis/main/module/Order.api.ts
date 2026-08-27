import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../generated/http-client';
import { apiFormat, apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';
import { OrderFilterDto, OrderStatus, PaymentMethod } from '../generated/data-contracts';

export interface OrderItemIngredientResponseDto {
  id?: string;
  orderItemId?: string;
  ingredientId: number;
  quantity: number;
  ingredientName?: string;
  ingredientPrice?: number;
}

export interface OrderItemResponseDto {
  id?: string;
  orderId?: string;
  productId?: string | null;
  productVariantId?: number | null;
  comboId?: string | null;
  quantity: number;
  price?: number | null;
  productName?: string;
  variantName?: string;
  product?: {
    id: string;
    name: string;
    img?: string;
    basePrice: number;
  };
  productVariant?: {
    id: number;
    name: string;
    size?: string;
    type?: string;
    modifiedPrice: number;
  };
  ingredients?: OrderItemIngredientResponseDto[];
}

export interface OrderResponseDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod?: PaymentMethod | null;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string | null;
  userId?: string | null;
  addressId?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  guestAddress?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  orderItems?: OrderItemResponseDto[];
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export class OrderApiModule {
  public http: HttpClient<string>;

  constructor(config: AxiosRequestConfig) {
    this.http = new HttpClient<string>({
      ...config,
    });
  }

  /**
   * Lấy danh sách tất cả đơn hàng phân trang (Admin)
   */
  getOrders = async (filter: OrderFilterDto): Promise<BaseResponse<OrderResponseDto[]>> => {
    try {
      const response = await this.http.instance.post('/api/order/get-page', filter);
      return apiFormatPaginated<OrderResponseDto, OrderResponseDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  getById = async (id: string): Promise<BaseResponse<OrderResponseDto>> => {
    try {
      const response = await this.http.instance.get(`/api/order/${id}`);
      return apiFormat<OrderResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật trạng thái đơn hàng (Admin)
   */
  updateStatus = async (id: string, status: OrderStatus): Promise<BaseResponse<OrderResponseDto>> => {
    try {
      const response = await this.http.instance.patch(`/api/order/${id}/status`, { status });
      return apiFormat<OrderResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Hủy đơn hàng (Admin)
   */
  cancelOrder = async (id: string, reason?: string): Promise<BaseResponse<OrderResponseDto>> => {
    try {
      const response = await this.http.instance.post(`/api/order/${id}/cancel`, { reason });
      return apiFormat<OrderResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
