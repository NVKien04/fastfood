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

import { ReviewControllerGetPageData } from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Review<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Review
   * @name ReviewControllerGetPage
   * @request POST:/api/review/get-page
   */
  reviewControllerGetPage = (params: RequestParams = {}) =>
    this.request<ReviewControllerGetPageData, any>({
      path: `/api/review/get-page`,
      method: 'POST',
      ...params,
    });
}
