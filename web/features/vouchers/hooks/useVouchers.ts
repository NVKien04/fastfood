'use client';

import { useState, useMemo } from 'react';
import { useMyCoupons } from '@/services/react-query/queries/coupon';
import { CouponItemDto } from '@/services/apis/main/module/Coupon.api';

export type VoucherFilterTab = 'ALL' | 'EXCLUSIVE' | 'DISCOUNT' | 'FREESHIP';

export const useVouchers = () => {
  const [activeTab, setActiveTab] = useState<VoucherFilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: vouchersData, isLoading, error, refetch } = useMyCoupons();

  const vouchers = useMemo<CouponItemDto[]>(() => {
    if (!vouchersData) return [];
    return vouchersData;
  }, [vouchersData]);

  const filteredVouchers = useMemo(() => {
    let list = [...vouchers];

    // Filter by tab
    if (activeTab === 'EXCLUSIVE') {
      list = list.filter((v) => v.isExclusive || v.code.includes('VIP') || v.code.includes('BIRTHDAY') || v.code.includes('COMEBACK') || v.code.includes('SPECIAL'));
    } else if (activeTab === 'FREESHIP') {
      list = list.filter((v) => v.code.includes('FREESHIP') || v.name.toLowerCase().includes('freeship') || v.name.toLowerCase().includes('vận chuyển'));
    } else if (activeTab === 'DISCOUNT') {
      list = list.filter((v) => !v.code.includes('FREESHIP') && !v.name.toLowerCase().includes('freeship'));
    }

    // Filter by search query (code or name)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.code.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          (v.description && v.description.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [vouchers, activeTab, searchQuery]);

  const countByTab = useMemo(() => {
    return {
      ALL: vouchers.length,
      EXCLUSIVE: vouchers.filter(
        (v) => v.isExclusive || v.code.includes('VIP') || v.code.includes('BIRTHDAY') || v.code.includes('COMEBACK') || v.code.includes('SPECIAL'),
      ).length,
      DISCOUNT: vouchers.filter((v) => !v.code.includes('FREESHIP') && !v.name.toLowerCase().includes('freeship')).length,
      FREESHIP: vouchers.filter((v) => v.code.includes('FREESHIP') || v.name.toLowerCase().includes('freeship') || v.name.toLowerCase().includes('vận chuyển')).length,
    };
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
