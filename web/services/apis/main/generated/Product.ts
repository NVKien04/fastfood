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

import { ProductControllerGetPageData } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Product<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Product
   * @name ProductControllerGetPage
   * @request POST:/api/product/get-page
   */
  productControllerGetPage = (params: RequestParams = {}) =>
    this.request<ProductControllerGetPageData, any>({
      path: `/api/product/get-page`,
      method: 'POST',
      ...params,
    });
}
