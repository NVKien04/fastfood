'use client';

import { useState, useMemo } from 'react';
import { useMyOrders as useMyOrdersQuery } from '@/services/react-query/queries/order';
import { useCancelOrder } from '@/services/react-query/mutations/order';
import { OrderResponseDto } from '@/services/apis/main/module/Order.api';

export type OrderFilterTab = 'ALL' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

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
    let list = [...orders];

    // Filter by tab
    if (activeTab === 'PROCESSING') {
      list = list.filter(
        (o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'READY_FOR_SHIPMENT',
      );
    } else if (activeTab === 'DELIVERED') {
      list = list.filter((o) => o.status === 'DELIVERED');
    } else if (activeTab === 'CANCELLED') {
      list = list.filter((o) => o.status === 'CANCELLED');
    }

    // Filter by search query (order number or phone)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          (o.guestPhone && o.guestPhone.includes(q)) ||
          (o.guestName && o.guestName.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [orders, activeTab, searchQuery]);

  const countByTab = useMemo(() => {
    return {
      ALL: orders.length,
      PROCESSING: orders.filter(
        (o) => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING' || o.status === 'READY_FOR_SHIPMENT',
      ).length,
      DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
      CANCELLED: orders.filter((o) => o.status === 'CANCELLED').length,
    };
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
