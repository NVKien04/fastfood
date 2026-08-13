import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../generated/http-client';
import { apiFormat } from '../../api';
import { BaseResponse } from '../../api.type';

export interface CreateOrderItemIngredientPayload {
  ingredientId: number;
  quantity?: number;
}

export interface CreateOrderItemPayload {
  productId: string;
  productVariantId?: number;
  ingredients?: CreateOrderItemIngredientPayload[];
  quantity: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  addressId?: string;
  guestName?: string;
  guestPhone?: string;
  guestAddress?: string;
  notes?: string;
  paymentMethod?: string;
}

export interface OrderResponseDto {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  subTotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string;
  guestName?: string;
  guestPhone?: string;
  guestAddress?: string;
  createdAt: string;
}

export class OrderApiModule {
  public http: HttpClient<string>;

  constructor(config: AxiosRequestConfig) {
    this.http = new HttpClient<string>({
      ...config,
    });
  }

  /**
   * Tạo mới đơn hàng (Hỗ trợ cả Auth User & Guest Checkout)
   */
  createOrder = async (data: CreateOrderPayload): Promise<BaseResponse<OrderResponseDto>> => {
    try {
      const response = await this.http.instance.post('/api/order', data);
      return apiFormat<OrderResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Đặt hàng thất bại';
      console.error('Error creating order:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy danh sách đơn hàng cá nhân
   */
  getMyOrders = async (): Promise<BaseResponse<OrderResponseDto[]>> => {
    try {
      const response = await this.http.instance.get('/api/order/my-orders');
      return apiFormat<OrderResponseDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error fetching my orders';
      console.error('Error fetching my orders:', error);
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
      const message = error instanceof Error ? error.message : 'Error fetching order detail';
      console.error('Error fetching order detail:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
