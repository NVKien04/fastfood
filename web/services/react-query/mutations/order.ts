import { useMutation } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { CreateOrderPayload, OrderResponseDto } from '@/services/apis/main/module/Order.api';
import { ORDER_MY_ORDERS } from '../constants/order-keys';
import { CART_DETAIL } from '../constants/cart-keys';
import { invalidateListQueries } from '../query-client';
import { Nullable } from '@/types';

export const useOrderCreate = () => {
  const mutationFn = async (params: CreateOrderPayload): Promise<Nullable<OrderResponseDto>> => {
    const response = await ApiMain.instance.order.createOrder(params);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data) {
        invalidateListQueries([ORDER_MY_ORDERS], [CART_DETAIL]);
      }
    },
  });
};

export const useCreateOrder = useOrderCreate;
