import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import {
  ProductDetailResponseDto,
  ProductFilterDto,
} from '@/services/apis/main/generated/data-contracts';
import { BaseResponse } from '@/services/apis/api.type';
import { PRODUCT_LIST, PRODUCT_DETAIL, PRODUCT_BY_SLUG } from '../constants/product-keys';
import { Nullable } from '@/types';

export const useProductList = (filter: ProductFilterDto) => {
  const queryFn = async (): Promise<Nullable<BaseResponse<ProductDetailResponseDto[]>>> => {
    const response = await ApiMain.instance.product.getProducts(filter);
    if (response.kind !== 'OK') return null;
    return response;
  };

  return useQuery({
    queryKey: [PRODUCT_LIST, filter],
    queryFn,
  });
};

export const useProductDetail = (id?: string) => {
  const queryFn = async (): Promise<Nullable<ProductDetailResponseDto>> => {
    if (!id) return null;
    const response = await ApiMain.instance.product.getById(id);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [PRODUCT_DETAIL, id],
    queryFn,
    enabled: !!id,
  });
};

export const useProductBySlug = (slug?: string) => {
  const queryFn = async (): Promise<Nullable<ProductDetailResponseDto>> => {
    if (!slug) return null;
    const response = await ApiMain.instance.product.getBySlug(slug);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [PRODUCT_BY_SLUG, slug],
    queryFn,
    enabled: !!slug,
  });
};
