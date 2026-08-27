import { AxiosRequestConfig } from 'axios';
import { Address } from '../generated/Address';
import { apiFormat } from '../../api';
import { BaseResponse } from '../../api.type';
import { CreateAddressDto, UpdateAddressDto } from '../generated/data-contracts';

export interface AddressItemResponse {
  id: string;
  userId: string;
  street: string;
  city: string;
  district: string;
  ward?: string;
  isDefault: number;
  createdAt: string;
  updatedAt: string;
}

export class AddressApiModule {
  public api: Address<string>;

  constructor(config: AxiosRequestConfig) {
    this.api = new Address<string>({
      ...config,
    });
  }

  /**
   * Lấy danh sách địa chỉ của người dùng hiện tại
   */
  getMyAddresses = async (): Promise<BaseResponse<AddressItemResponse[]>> => {
    try {
      const response = await this.api.addressControllerGetMyAddresses();
      return apiFormat<AddressItemResponse[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching my addresses:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Tạo địa chỉ mới
   */
  create = async (data: CreateAddressDto): Promise<BaseResponse<AddressItemResponse>> => {
    try {
      const response = await this.api.addressControllerCreate(data);
      return apiFormat<AddressItemResponse>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error creating address:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật địa chỉ
   */
  update = async (id: string, data: UpdateAddressDto): Promise<BaseResponse<AddressItemResponse>> => {
    try {
      const response = await this.api.addressControllerUpdate(id, data);
      return apiFormat<AddressItemResponse>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error updating address:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa địa chỉ
   */
  delete = async (id: string): Promise<BaseResponse<unknown>> => {
    try {
      const response = await this.api.addressControllerDelete(id);
      return apiFormat<unknown>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error deleting address:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
