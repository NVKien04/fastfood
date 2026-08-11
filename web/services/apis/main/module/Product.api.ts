import { AxiosRequestConfig } from 'axios';
import { Product } from '../generated/Product';
import { apiFormat, apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';
import {
  ProductDetailResponseDto,
  ProductFilterDto,
} from '../generated/data-contracts';

export class ProductApiModule {
  public api: Product<string>;

  constructor(config: AxiosRequestConfig) {
    this.api = new Product<string>({
      ...config,
    });
  }

  /**
   * Lấy danh sách sản phẩm phân trang
   */
  getProducts = async (
    filter: ProductFilterDto,
  ): Promise<BaseResponse<ProductDetailResponseDto[]>> => {
    try {
      const response = await this.api.productControllerGetPage(filter);
      return apiFormatPaginated<ProductDetailResponseDto, ProductDetailResponseDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching product list:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy chi tiết sản phẩm theo Slug (bao gồm biến thể và topping nguyên liệu)
   */
  getBySlug = async (slug: string): Promise<BaseResponse<ProductDetailResponseDto>> => {
    try {
      const response = await this.api.productControllerGetBySlug(slug);
      return apiFormat<ProductDetailResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching product detail by slug:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  getById = async (id: string): Promise<BaseResponse<ProductDetailResponseDto>> => {
    try {
      const response = await this.api.productControllerGetById(id);
      return apiFormat<ProductDetailResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching product detail by id:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
