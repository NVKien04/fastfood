import { AxiosRequestConfig } from 'axios';
import { HttpClient } from '../generated/http-client';
import { apiFormat, apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';
import { CreateIngredientDto, UpdateIngredientDto } from '../generated/data-contracts';

export interface IngredientResponseDto {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  sortOrder: number;
  price: number;
  isRequired: number;
  isActive: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IngredientFilterDto {
  page?: number;
  limit?: number;
  categoryId?: number;
  isActive?: number;
}

export class IngredientApiModule {
  public http: HttpClient<string>;

  constructor(config: AxiosRequestConfig) {
    this.http = new HttpClient<string>({
      ...config,
    });
  }

  /**
   * Lấy danh sách nguyên liệu phân trang
   */
  getIngredients = async (filter: IngredientFilterDto = {}): Promise<BaseResponse<IngredientResponseDto[]>> => {
    try {
      const response = await this.http.instance.post('/api/ingredient/get-page', filter);
      return apiFormatPaginated<IngredientResponseDto, IngredientResponseDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy chi tiết nguyên liệu theo ID
   */
  getById = async (id: number): Promise<BaseResponse<IngredientResponseDto>> => {
    try {
      const response = await this.http.instance.get(`/api/ingredient/${id}`);
      return apiFormat<IngredientResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Tạo nguyên liệu mới (Admin)
   */
  create = async (data: CreateIngredientDto): Promise<BaseResponse<IngredientResponseDto>> => {
    try {
      const response = await this.http.instance.post('/api/ingredient', data);
      return apiFormat<IngredientResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật nguyên liệu (Admin)
   */
  update = async (id: number, data: UpdateIngredientDto): Promise<BaseResponse<IngredientResponseDto>> => {
    try {
      const response = await this.http.instance.patch(`/api/ingredient/${id}`, data);
      return apiFormat<IngredientResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa nguyên liệu (Admin)
   */
  delete = async (id: number): Promise<BaseResponse<unknown>> => {
    try {
      const response = await this.http.instance.delete(`/api/ingredient/${id}`);
      return apiFormat<unknown>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
