'use client';

import { useState, useMemo } from 'react';
import { useMyCoupons } from '@/services/react-query/queries/coupon';
import { VoucherFilterTab, CouponItemDto } from '../types';
import { filterVouchersByTabAndQuery, calculateVoucherCountsByTab } from '../utils/voucher.utils';

export type { VoucherFilterTab };

export const useVouchers = () => {
  const [activeTab, setActiveTab] = useState<VoucherFilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: vouchersData, isLoading, error, refetch } = useMyCoupons();

  const vouchers = useMemo<CouponItemDto[]>(() => {
    if (!vouchersData) return [];
    return vouchersData;
  }, [vouchersData]);

  const filteredVouchers = useMemo(() => {
    return filterVouchersByTabAndQuery(vouchers, activeTab, searchQuery);
  }, [vouchers, activeTab, searchQuery]);

  const countByTab = useMemo(() => {
    return calculateVoucherCountsByTab(vouchers);
  }, [vouchers]);

  return {
    vouchers: filteredVouchers,
    rawVouchers: vouchers,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    countByTab,
    refetch,
  };
};
