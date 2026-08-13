import { AxiosRequestConfig } from 'axios';
import { Category } from '../generated/Category';
import { apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';

export interface CategoryResponseDto {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: number | boolean;
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
      console.error('Error fetching category list:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
