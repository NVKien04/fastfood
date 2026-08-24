import { AxiosRequestConfig } from 'axios';
import { Product } from '../generated/Product';
import { apiFormat, apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';
import {
  ProductDetailResponseDto,
  ProductFilterDto,
  CreateProductDto,
  UpdateProductStatusDto,
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
  getProducts = async (filter: ProductFilterDto): Promise<BaseResponse<ProductDetailResponseDto[]>> => {
    try {
      const response = await this.api.productControllerGetPage(filter);
      return apiFormatPaginated<ProductDetailResponseDto, ProductDetailResponseDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
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
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Tạo sản phẩm mới (Admin)
   */
  create = async (data: CreateProductDto): Promise<BaseResponse<ProductDetailResponseDto>> => {
    try {
      const response = await this.api.productControllerCreate(data);
      return apiFormat<ProductDetailResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật sản phẩm (Admin)
   */
  update = async (id: string, data: CreateProductDto): Promise<BaseResponse<ProductDetailResponseDto>> => {
    try {
      const response = await this.api.productControllerUpdate(id, data);
      return apiFormat<ProductDetailResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa sản phẩm (Admin)
   */
  delete = async (id: string): Promise<BaseResponse<unknown>> => {
    try {
      const response = await this.api.productControllerDelete(id);
      return apiFormat<unknown>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật trạng thái sản phẩm (Admin)
   */
  updateStatus = async (id: string, data: UpdateProductStatusDto): Promise<BaseResponse<unknown>> => {
    try {
      const response = await this.api.productControllerUpdateStatus(id, data);
      return apiFormat<unknown>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
