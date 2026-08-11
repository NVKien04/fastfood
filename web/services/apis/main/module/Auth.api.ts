import { AxiosRequestConfig } from 'axios';
import { Auth } from '../generated/Auth';
import { apiFormat } from '../../api';
import { BaseResponse } from '../../api.type';
import { LoginDto, LoginResponseDto, AuthControllerLogoutData } from '../generated/data-contracts';

export class AuthApiModule {
  public api: Auth<string>;

  constructor(config: AxiosRequestConfig) {
    this.api = new Auth<string>({
      ...config,
    });
  }

  /**
   * Đăng nhập hệ thống
   */
  login = async (data: LoginDto): Promise<BaseResponse<LoginResponseDto>> => {
    try {
      const response = await this.api.authControllerLogin(data);
      return apiFormat<LoginResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error logging in:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Đăng xuất hệ thống
   */
  logout = async (): Promise<BaseResponse<AuthControllerLogoutData>> => {
    try {
      const response = await this.api.authControllerLogout();
      return apiFormat<AuthControllerLogoutData>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error logging out:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  /**
   * Làm mới Access Token bằng Refresh Token (qua HTTP-only cookie)
   */
  refreshToken = async (): Promise<BaseResponse<LoginResponseDto>> => {
    try {
      const response = await this.api.authControllerRefresh();
      return apiFormat<LoginResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error refreshing token:', error);
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
