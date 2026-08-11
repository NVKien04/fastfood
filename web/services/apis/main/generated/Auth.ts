/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AuthControllerChangePasswordData,
  AuthControllerLoginData,
  AuthControllerLogoutData,
  AuthControllerRefreshData,
  AuthControllerRegisterData,
  AuthControllerTestAdminData,
  AuthControllerTestCustomerData,
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Auth<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerRegister
   * @summary Đăng ký tài khoản mới
   * @request POST:/api/auth/register
   */
  authControllerRegister = (data: CreateUserDto, params: RequestParams = {}) =>
    this.request<AuthControllerRegisterData, any>({
      path: `/api/auth/register`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerLogin
   * @summary Đăng nhập hệ thống
   * @request POST:/api/auth/login
   */
  authControllerLogin = (data: LoginDto, params: RequestParams = {}) =>
    this.request<AuthControllerLoginData, void>({
      path: `/api/auth/login`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerLogout
   * @summary Đăng xuất hệ thống
   * @request POST:/api/auth/logout
   */
  authControllerLogout = (params: RequestParams = {}) =>
    this.request<AuthControllerLogoutData, any>({
      path: `/api/auth/logout`,
      method: 'POST',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerRefresh
   * @summary Làm mới Access Token bằng Refresh Token từ cookie
   * @request POST:/api/auth/refresh
   */
  authControllerRefresh = (params: RequestParams = {}) =>
    this.request<AuthControllerRefreshData, void>({
      path: `/api/auth/refresh`,
      method: 'POST',
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerChangePassword
   * @summary Đổi mật khẩu tài khoản
   * @request POST:/api/auth/change-password
   * @secure
   */
  authControllerChangePassword = (data: ChangePasswordDto, params: RequestParams = {}) =>
    this.request<AuthControllerChangePasswordData, void>({
      path: `/api/auth/change-password`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerTestCustomer
   * @summary Test truy cập với quyền CUSTOMER
   * @request POST:/api/auth/test-customer
   * @secure
   */
  authControllerTestCustomer = (params: RequestParams = {}) =>
    this.request<AuthControllerTestCustomerData, any>({
      path: `/api/auth/test-customer`,
      method: 'POST',
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags Auth
   * @name AuthControllerTestAdmin
   * @summary Test truy cập với quyền ADMIN
   * @request POST:/api/auth/test-admin
   * @secure
   */
  authControllerTestAdmin = (params: RequestParams = {}) =>
    this.request<AuthControllerTestAdminData, any>({
      path: `/api/auth/test-admin`,
      method: 'POST',
      secure: true,
      ...params,
    });
}
