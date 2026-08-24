import { AxiosRequestConfig } from 'axios';
import { Category } from '../generated/Category';
import { apiFormat, apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';
import { CreateCategoryDto, UpdateCategoryDto } from '../generated/data-contracts';

export interface CategoryResponseDto {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: number | boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFilterDto extends Record<string, unknown> {
  page?: number;
  limit?: number;
  orderby?: string;
  orderDirection?: string;
}

export class CategoryApiModule {
  public api: Category<string>;

  constructor(config: AxiosRequestConfig) {
    this.api = new Category<string>({
      ...config,
    });
  }

  /**
   * Lấy danh sách danh mục phân trang
   */
  getCategories = async (
    filter: CategoryFilterDto = { page: 1, limit: 100 },
  ): Promise<BaseResponse<CategoryResponseDto[]>> => {
    try {
      const response = await this.api.categoryControllerGetPage(filter);
      return apiFormatPaginated<CategoryResponseDto, CategoryResponseDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy chi tiết danh mục theo ID
   */
  getById = async (id: number): Promise<BaseResponse<CategoryResponseDto>> => {
    try {
      const response = await this.api.categoryControllerGetById(id);
      return apiFormat<CategoryResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Tạo danh mục mới (Admin)
   */
  create = async (data: CreateCategoryDto): Promise<BaseResponse<CategoryResponseDto>> => {
    try {
      const response = await this.api.categoryControllerCreate(data);
      return apiFormat<CategoryResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật danh mục (Admin)
   */
  update = async (id: number, data: UpdateCategoryDto): Promise<BaseResponse<CategoryResponseDto>> => {
    try {
      const response = await this.api.categoryControllerUpdate(id, data);
      return apiFormat<CategoryResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa danh mục (Admin)
   */
  delete = async (id: number): Promise<BaseResponse<unknown>> => {
    try {
      const response = await this.api.categoryControllerDelete(id);
      return apiFormat<unknown>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
