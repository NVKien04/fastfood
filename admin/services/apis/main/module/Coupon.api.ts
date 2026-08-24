import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../generated/http-client';
import { apiFormat, apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';
import { CreateCouponDto, UpdateCouponDto, CouponFilterDto } from '../generated/data-contracts';

export interface CouponResponseDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  value: number;
  minOrderAmount: number;
  maxUser: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export class CouponApiModule {
  public http: HttpClient<string>;

  constructor(config: AxiosRequestConfig) {
    this.http = new HttpClient<string>({
      ...config,
    });
  }

  /**
   * Lấy danh sách coupon phân trang
   */
  getCoupons = async (filter: CouponFilterDto): Promise<BaseResponse<CouponResponseDto[]>> => {
    try {
      const response = await this.http.instance.get('/api/coupon', { params: filter });
      return apiFormatPaginated<CouponResponseDto, CouponResponseDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy chi tiết coupon theo ID
   */
  getById = async (id: number): Promise<BaseResponse<CouponResponseDto>> => {
    try {
      const response = await this.http.instance.get(`/api/coupon/${id}`);
      return apiFormat<CouponResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Tạo coupon mới (Admin)
   */
  create = async (data: CreateCouponDto): Promise<BaseResponse<CouponResponseDto>> => {
    try {
      const response = await this.http.instance.post('/api/coupon', data);
      return apiFormat<CouponResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật coupon (Admin)
   */
  update = async (id: number, data: UpdateCouponDto): Promise<BaseResponse<CouponResponseDto>> => {
    try {
      const response = await this.http.instance.patch(`/api/coupon/${id}`, data);
      return apiFormat<CouponResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa coupon (Admin)
   */
  delete = async (id: number): Promise<BaseResponse<unknown>> => {
    try {
      const response = await this.http.instance.delete(`/api/coupon/${id}`);
      return apiFormat<unknown>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
