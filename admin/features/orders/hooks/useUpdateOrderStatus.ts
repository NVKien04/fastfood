'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ApiMain } from '@/services/apis/main/api.main';
import { ORDER_LIST, ORDER_DETAIL } from '@/constants';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';

interface UpdateOrderStatusParams {
  id: string;
  status: OrderStatus;
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateOrderStatusParams) => {
      const response = await ApiMain.instance.order.updateStatus(id, status);
      if (response.kind === 'ERROR') {
        throw new Error(response.error || t('ORDERS.STATUS_UPDATE_FAILED'));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(t('ORDERS.STATUS_UPDATED'));
      queryClient.invalidateQueries({ queryKey: [ORDER_LIST] });
      queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL, variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('ORDERS.STATUS_UPDATE_FAILED'));
    },
  });
};
