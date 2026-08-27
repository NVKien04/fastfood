'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ApiMain } from '@/services/apis/main/api.main';
import { ORDER_LIST, ORDER_DETAIL } from '@/constants';

interface CancelOrderParams {
  id: string;
  reason?: string;
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, reason }: CancelOrderParams) => {
      const response = await ApiMain.instance.order.cancelOrder(id, reason);
      if (response.kind === 'ERROR') {
        throw new Error(response.error || t('ORDERS.ORDER_CANCEL_FAILED'));
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(t('ORDERS.ORDER_CANCELLED'));
      queryClient.invalidateQueries({ queryKey: [ORDER_LIST] });
      queryClient.invalidateQueries({ queryKey: [ORDER_DETAIL, variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('ORDERS.ORDER_CANCEL_FAILED'));
    },
  });
};
