import { AxiosRequestConfig } from 'axios';
import { Auth } from '../generated/Auth';
import { apiFormat } from '../../api';
import { BaseResponse } from '../../api.type';
import {
  LoginDto,
  LoginResponseDto,
  AuthControllerLogoutData,
  CreateUserDto,
  AuthControllerRegisterData,
} from '../generated/data-contracts';

export class AuthApiModule {
  public api: Auth<string>;

  constructor(config: AxiosRequestConfig) {
    this.api = new Auth<string>({
      ...config,
    });
  }

  register = async (data: CreateUserDto): Promise<BaseResponse<AuthControllerRegisterData>> => {
    try {
      const response = await this.api.authControllerRegister(data);
      return apiFormat<AuthControllerRegisterData>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  login = async (data: LoginDto): Promise<BaseResponse<LoginResponseDto>> => {
    try {
      const response = await this.api.authControllerLogin(data);
      return apiFormat<LoginResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  logout = async (): Promise<BaseResponse<AuthControllerLogoutData>> => {
    try {
      const response = await this.api.authControllerLogout();
      return apiFormat<AuthControllerLogoutData>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };

  refreshToken = async (): Promise<BaseResponse<LoginResponseDto>> => {
    try {
      const response = await this.api.authControllerRefresh();
      return apiFormat<LoginResponseDto>(response);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { kind: 'ERROR', data: null, error: message };
    }
  };
}
