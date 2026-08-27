'use client';

import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { ORDER_DETAIL } from '@/constants';
import { OrderResponseDto } from '../types';

export const useOrderDetail = (id: string) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: [ORDER_DETAIL, id],
    queryFn: () => ApiMain.instance.order.getById(id),
    enabled: !!id,
  });

  const order: OrderResponseDto | null = data?.kind === 'OK' && data.data ? data.data : null;

  return {
    order,
    isLoading,
    isFetching,
    error: error || (data?.kind === 'ERROR' ? data.error : null),
    refetch,
  };
};
