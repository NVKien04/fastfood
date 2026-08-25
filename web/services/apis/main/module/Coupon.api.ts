import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../generated/http-client';
import { apiFormat } from '../../api';
import { BaseResponse } from '../../api.type';

export interface CouponItemDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  value: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  isUsed?: boolean;
  isExclusive?: boolean;
  isExpired?: boolean;
  canUse?: boolean;
  maxUser?: number;
  currentUses?: number;
}

export interface ApplyCouponPayload {
  code: string;
  subTotal: number;
}

export interface ApplyCouponResultDto {
  code: string;
  name: string;
  discount: number;
  finalTotal: number;
}

export class CouponApiModule {
  public http: HttpClient<string>;

  constructor(config: AxiosRequestConfig) {
    this.http = new HttpClient<string>({
      ...config,
    });
  }

  /**
   * Lấy danh sách mã giảm giá đang hoạt động (Công khai)
   */
  getActiveCoupons = async (): Promise<BaseResponse<CouponItemDto[]>> => {
    try {
      const response = await this.http.instance.get('/api/coupon/active');
      return apiFormat<CouponItemDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error fetching active coupons';
      console.error('Error fetching active coupons:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy danh sách voucher trong ví của người dùng (kết hợp độc quyền & công khai)
   */
  getMyCoupons = async (): Promise<BaseResponse<CouponItemDto[]>> => {
    try {
      const response = await this.http.instance.get('/api/coupon/my-coupons');
      return apiFormat<CouponItemDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error fetching my coupons';
      console.error('Error fetching my coupons:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Kiểm tra và áp dụng mã giảm giá khi thanh toán
   */
  applyCoupon = async (payload: ApplyCouponPayload): Promise<BaseResponse<ApplyCouponResultDto>> => {
    try {
      const response = await this.http.instance.post('/api/coupon/apply', payload);
      return apiFormat<ApplyCouponResultDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error applying coupon';
      console.error('Error applying coupon:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
