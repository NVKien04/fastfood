import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { OrderResponseDto } from '@/services/apis/main/module/Order.api';
import { ORDER_MY_ORDERS, ORDER_DETAIL } from '../constants/order-keys';
import { Nullable } from '@/types';

export const useMyOrders = () => {
  const queryFn = async (): Promise<Nullable<OrderResponseDto[]>> => {
    const response = await ApiMain.instance.order.getMyOrders();
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [ORDER_MY_ORDERS],
    queryFn,
  });
};

export const useOrderDetail = (id?: string) => {
  const queryFn = async (): Promise<Nullable<OrderResponseDto>> => {
    if (!id) return null;
    const response = await ApiMain.instance.order.getById(id);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [ORDER_DETAIL, id],
    queryFn,
    enabled: !!id,
  });
};
