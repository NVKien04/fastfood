import { AxiosRequestConfig } from 'axios';
import { Users } from '../generated/Users';
import { apiFormat, apiFormatPaginated } from '../../api';
import { BaseResponse } from '../../api.type';
import { UpdateUserDto, UserFilterDto, UserResponseDto } from '../generated/data-contracts';

export class UserApiModule {
  public api: Users<string>;

  constructor(config: AxiosRequestConfig) {
    this.api = new Users<string>({
      ...config,
    });
  }

  /**
   * Lấy thông tin cá nhân người dùng đang đăng nhập
   */
  getProfile = async (): Promise<BaseResponse<UserResponseDto>> => {
    try {
      const response = await this.api.userControllerGetInfo();
      return apiFormat<UserResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật thông tin người dùng (Admin)
   */
  updateUser = async (data: UpdateUserDto): Promise<BaseResponse<UserResponseDto>> => {
    try {
      const response = await this.api.userControllerUpdate(data);
      return apiFormat<UserResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy danh sách người dùng phân trang (Admin)
   */
  getUserPage = async (filter: UserFilterDto): Promise<BaseResponse<UserResponseDto[]>> => {
    try {
      const response = await this.api.userControllerGetPage(filter);
      return apiFormatPaginated<UserResponseDto, UserResponseDto[]>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Lấy chi tiết người dùng theo ID (Admin)
   */
  getUserById = async (id: string): Promise<BaseResponse<UserResponseDto>> => {
    try {
      const response = await this.api.userControllerGetById(id);
      return apiFormat<UserResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Xóa người dùng (Admin)
   */
  deleteUser = async (id: string): Promise<BaseResponse<unknown>> => {
    try {
      const response = await this.api.userControllerDelete(id);
      return apiFormat<unknown>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
