'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { ORDER_LIST } from '@/constants';
import { OrderFilterStatus, OrderResponseDto, OrderStatsSummary } from '../types';
import { calculateOrderStats } from '../utils/order.utils';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';

export const useOrderList = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<OrderFilterStatus>('ALL');
  const [search, setSearch] = useState<string>('');

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: [ORDER_LIST, { page, limit, status }],
    queryFn: () =>
      ApiMain.instance.order.getOrders({
        page,
        limit,
        ...(status !== 'ALL' ? { status: status as OrderStatus } : {}),
      }),
  });

  const rawOrders: OrderResponseDto[] = useMemo(() => {
    if (data?.kind === 'OK' && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const pagination = data?.kind === 'OK' ? data.pagination : undefined;

  // Lọc tìm kiếm client-side theo mã đơn hàng hoặc tên/sđt khách hàng
  const filteredOrders = useMemo(() => {
    if (!search.trim()) return rawOrders;
    const query = search.toLowerCase().trim();
    return rawOrders.filter((order) => {
      const orderNumberMatch = order.orderNumber.toLowerCase().includes(query);
      const guestNameMatch = order.guestName?.toLowerCase().includes(query) ?? false;
      const userNameMatch = order.user?.name.toLowerCase().includes(query) ?? false;
      const phoneMatch =
        (order.guestPhone?.includes(query) ?? false) ||
        (order.user?.phone?.includes(query) ?? false);
      return orderNumberMatch || guestNameMatch || userNameMatch || phoneMatch;
    });
  }, [rawOrders, search]);

  const stats: OrderStatsSummary = useMemo(() => {
    return calculateOrderStats(rawOrders);
  }, [rawOrders]);

  const handleStatusChange = (newStatus: OrderFilterStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    orders: filteredOrders,
    rawOrders,
    pagination,
    isLoading,
    isFetching,
    error,
    page,
    limit,
    status,
    search,
    stats,
    handleStatusChange,
    handleSearchChange,
    handlePageChange,
    setLimit,
    refetch,
  };
};
