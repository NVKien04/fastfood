import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../generated/http-client';
import { apiFormat, apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';
import { OrderFilterDto, OrderStatus } from '../generated/data-contracts';

export interface OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  productImg?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  ingredients?: { name: string; price: number; quantity: number }[];
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
  userId?: string;
  user?: { id: string; name: string; email: string; phone?: string };
  items?: OrderItemResponseDto[];
  createdAt: string;
  updatedAt?: string;
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
      const response = await this.http.instance.get('/api/order', { params: filter });
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
      const response = await this.http.instance.patch(`/api/order/${id}/cancel`, { reason });
      return apiFormat<OrderResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
