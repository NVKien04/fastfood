import { AxiosResponse } from 'axios';
import { BackendResponse, BaseResponse } from './api.type';

export const apiFormat = <T>(response: AxiosResponse<unknown>): BaseResponse<T> => {
  if (response.status > 299) {
    return { kind: 'ERROR', data: null, error: 'HTTP error ' + response.status, status: response.status };
  }

  const body = response.data as BackendResponse<T>;
  if (body && typeof body === 'object' && 'success' in body) {
    if (body.success) {
      return {
        kind: 'OK',
        data: body.data as T,
        ...(body.meta ? { pagination: body.meta } : {}),
      };
    } else {
      return { kind: 'ERROR', data: null, error: body.message || 'API request failed' };
    }
  }
  return { kind: 'OK', data: response.data as T };
};

export const apiFormatPaginated = <TItem, TPaginated extends TItem[]>(
  response: AxiosResponse<unknown>,
): BaseResponse<TPaginated> => {
  return apiFormat<TPaginated>(response);
};
