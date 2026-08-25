import { CouponItemDto, VoucherFilterTab, VoucherTabCounts } from '../types';

/**
 * Kiểm tra xem coupon có phải là độc quyền / VIP / sự kiện đặc biệt
 */
export const isExclusiveVoucher = (voucher: CouponItemDto): boolean => {
  return (
    !!voucher.isExclusive ||
    voucher.code.includes('VIP') ||
    voucher.code.includes('BIRTHDAY') ||
    voucher.code.includes('COMEBACK') ||
    voucher.code.includes('SPECIAL')
  );
};

/**
 * Kiểm tra xem coupon có phải loại miễn phí vận chuyển
 */
export const isFreeshipVoucher = (voucher: CouponItemDto): boolean => {
  return (
    voucher.code.includes('FREESHIP') ||
    voucher.name.toLowerCase().includes('freeship') ||
    voucher.name.toLowerCase().includes('vận chuyển')
  );
};

/**
 * Lọc danh sách vouchers theo Tab và từ khóa tìm kiếm
 */
export const filterVouchersByTabAndQuery = (
  vouchers: CouponItemDto[],
  activeTab: VoucherFilterTab,
  searchQuery: string,
): CouponItemDto[] => {
  let list = [...vouchers];

  // 1. Lọc theo tab
  if (activeTab === 'EXCLUSIVE') {
    list = list.filter(isExclusiveVoucher);
  } else if (activeTab === 'FREESHIP') {
    list = list.filter(isFreeshipVoucher);
  } else if (activeTab === 'DISCOUNT') {
    list = list.filter((v) => !isFreeshipVoucher(v));
  }

  // 2. Lọc theo từ khóa tìm kiếm (mã voucher, tên, mô tả)
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (v) =>
        v.code.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        (v.description && v.description.toLowerCase().includes(q)),
    );
  }

  return list;
};

/**
 * Tính số lượng vouchers theo từng tab
 */
export const calculateVoucherCountsByTab = (vouchers: CouponItemDto[]): VoucherTabCounts => {
  return {
    ALL: vouchers.length,
    EXCLUSIVE: vouchers.filter(isExclusiveVoucher).length,
    DISCOUNT: vouchers.filter((v) => !isFreeshipVoucher(v)).length,
    FREESHIP: vouchers.filter(isFreeshipVoucher).length,
  };
};

/**
 * Format chuỗi ngày tháng theo định dạng dd/mm/yyyy
 */
export const formatVoucherDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

