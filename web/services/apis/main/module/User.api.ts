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
      console.log('response', response);
      return apiFormat<UserResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error fetching profile:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Cập nhật thông tin cá nhân
   */
  updateProfile = async (data: UpdateUserDto): Promise<BaseResponse<UserResponseDto>> => {
    try {
      const response = await this.api.userControllerUpdate(data);
      return apiFormat<UserResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error updating profile:', error);
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
      console.error('Error fetching user page:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
