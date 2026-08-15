import { useMutation } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import {
  AddToCartPayload,
  CartResponseDto,
  UpdateCartItemPayload,
} from '@/services/apis/main/module/Cart.api';
import { CART_DETAIL } from '../constants/cart-keys';
import { invalidateListQueries } from '../query-client';
import { Nullable } from '@/types';

export const useCartAdd = () => {
  const mutationFn = async (params: AddToCartPayload): Promise<Nullable<CartResponseDto>> => {
    const response = await ApiMain.instance.cart.addItem(params);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data) {
        invalidateListQueries([CART_DETAIL]);
      }
    },
  });
};

export interface UpdateCartItemVariables {
  itemId: string;
  data: UpdateCartItemPayload;
}

export const useCartItemUpdate = () => {
  const mutationFn = async (params: UpdateCartItemVariables): Promise<Nullable<CartResponseDto>> => {
    const response = await ApiMain.instance.cart.updateQuantity(params.itemId, params.data);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data) {
        invalidateListQueries([CART_DETAIL]);
      }
    },
  });
};

export const useCartItemRemove = () => {
  const mutationFn = async (itemId: string): Promise<Nullable<CartResponseDto>> => {
    const response = await ApiMain.instance.cart.removeItem(itemId);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data) {
        invalidateListQueries([CART_DETAIL]);
      }
    },
  });
};

export const useCartClear = () => {
  const mutationFn = async (): Promise<Nullable<unknown>> => {
    const response = await ApiMain.instance.cart.clearCart();
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data) {
        invalidateListQueries([CART_DETAIL]);
      }
    },
  });
};

export const useAddToCart = useCartAdd;
export const useUpdateCartItem = useCartItemUpdate;
export const useRemoveCartItem = useCartItemRemove;
export const useClearCart = useCartClear;
