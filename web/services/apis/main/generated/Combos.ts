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
  ComboControllerCreateData,
  ComboControllerFindAllData,
  ComboControllerFindBySlugData,
  ComboControllerFindOneData,
  ComboControllerRemoveData,
  CreateComboDto,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Combos<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Combo
   * @name ComboControllerCreate
   * @request POST:/api/combos
   */
  comboControllerCreate = (data: CreateComboDto, params: RequestParams = {}) =>
    this.request<ComboControllerCreateData, any>({
      path: `/api/combos`,
      method: 'POST',
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Combo
   * @name ComboControllerFindAll
   * @request GET:/api/combos
   */
  comboControllerFindAll = (params: RequestParams = {}) =>
    this.request<ComboControllerFindAllData, any>({
      path: `/api/combos`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Combo
   * @name ComboControllerFindOne
   * @request GET:/api/combos/{id}
   */
  comboControllerFindOne = (id: string, params: RequestParams = {}) =>
    this.request<ComboControllerFindOneData, any>({
      path: `/api/combos/${id}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Combo
   * @name ComboControllerRemove
   * @request DELETE:/api/combos/{id}
   */
  comboControllerRemove = (id: string, params: RequestParams = {}) =>
    this.request<ComboControllerRemoveData, any>({
      path: `/api/combos/${id}`,
      method: 'DELETE',
      ...params,
    });
  /**
   * No description
   *
   * @tags Combo
   * @name ComboControllerFindBySlug
   * @request GET:/api/combos/slug/{slug}
   */
  comboControllerFindBySlug = (slug: string, params: RequestParams = {}) =>
    this.request<ComboControllerFindBySlugData, any>({
      path: `/api/combos/slug/${slug}`,
      method: 'GET',
      ...params,
    });
}
