'use client';

import { useState, useMemo } from 'react';
import { useMyOrders as useMyOrdersQuery } from '@/services/react-query/queries/order';
import { useCancelOrder } from '@/services/react-query/mutations/order';
import { OrderFilterTab, OrderResponseDto } from '../types';
import { filterOrdersByTabAndQuery, calculateOrderCountsByTab } from '../utils/order.utils';

export type { OrderFilterTab };

export const useMyOrders = () => {
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('ALL');
  const [cancellingOrder, setCancellingOrder] = useState<OrderResponseDto | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: ordersData, isLoading, error, refetch } = useMyOrdersQuery();
  const cancelOrderMutation = useCancelOrder();

  const orders = useMemo<OrderResponseDto[]>(() => {
    if (!ordersData) return [];
    return ordersData;
  }, [ordersData]);

  const filteredOrders = useMemo(() => {
    return filterOrdersByTabAndQuery(orders, activeTab, searchQuery);
  }, [orders, activeTab, searchQuery]);

  const countByTab = useMemo(() => {
    return calculateOrderCountsByTab(orders);
  }, [orders]);

  const handleOpenCancelModal = (order: OrderResponseDto) => {
    setCancellingOrder(order);
  };

  const handleCloseCancelModal = () => {
    setCancellingOrder(null);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!cancellingOrder) return;
    try {
      await cancelOrderMutation.mutateAsync({
        id: cancellingOrder.id,
        reason,
      });
      handleCloseCancelModal();
      refetch();
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  return {
    orders: filteredOrders,
    rawOrders: orders,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    countByTab,
    cancellingOrder,
    isCancelLoading: cancelOrderMutation.isPending,
    handleOpenCancelModal,
    handleCloseCancelModal,
    handleConfirmCancel,
    refetch,
  };
};
