'use client';

import { useTranslation } from 'react-i18next';
import { useVouchers, VoucherFilterTab } from './hooks/useVouchers';
import { VoucherCard } from './components/VoucherCard';
import { Ticket, Sparkles, Search, RefreshCw, Loader2, Gift } from 'lucide-react';
import Link from 'next/link';

export const VoucherWallet = () => {
  const { t } = useTranslation();
  const {
    vouchers,
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    countByTab,
    refetch,
  } = useVouchers();

  const tabs: { key: VoucherFilterTab; label: string }[] = [
    { key: 'ALL', label: t('VOUCHER.TAB_ALL', 'Tất cả') },
    { key: 'EXCLUSIVE', label: t('VOUCHER.TAB_EXCLUSIVE', 'Ưu đãi của tôi') },
    { key: 'DISCOUNT', label: t('VOUCHER.TAB_DISCOUNT', 'Mã giảm giá') },
    { key: 'FREESHIP', label: t('VOUCHER.TAB_FREESHIP', 'Freeship') },
  ];

  return (
    <div className="w-full max-w-300 mx-auto px-4 py-6 sm:py-10 transition-colors">
      {/* 1. Header Banner & Title */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-[#ff6900] to-amber-500 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/20 mb-8 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-48 h-48 rounded-full bg-amber-300/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('VOUCHER.WALLET_BADGE', 'Kho ưu đãi thành viên')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('VOUCHER.WALLET_TITLE', 'Ví Voucher & Mã giảm giá')}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
              {t(
                'VOUCHER.WALLET_SUBTITLE',
                'Quản lý tất cả mã giảm giá độc quyền dành riêng cho bạn và ưu đãi toàn hệ thống.',
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('COMMON.REFRESH', 'Làm mới')}</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {tabs.map((tab) => {
            const count = countByTab[tab.key];
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-[#ff6900] shadow-xs'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive
                      ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
                      : 'bg-gray-200/60 dark:bg-zinc-700/60 text-gray-500 dark:text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('VOUCHER.SEARCH_PLACEHOLDER', 'Tìm tên hoặc mã voucher...')}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
          />
        </div>
      </div>

      {/* 3. Vouchers List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff6900] mb-3" />
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            {t('VOUCHER.LOADING_VOUCHERS', 'Đang tải danh sách voucher...')}
          </p>
        </div>
      ) : vouchers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {vouchers.map((voucher) => (
            <VoucherCard key={voucher.id || voucher.code} voucher={voucher} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 border border-gray-100 dark:border-zinc-800 text-center shadow-xl shadow-gray-200/20 dark:shadow-black/20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
            {t('VOUCHER.EMPTY_TITLE', 'Không tìm thấy voucher phù hợp')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-sm mb-6">
            {t(
              'VOUCHER.EMPTY_DESC',
              'Hiện không có mã giảm giá nào trong danh mục này hoặc thử thay đổi từ khóa tìm kiếm.',
            )}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs sm:text-sm font-black shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
          >
            <span>{t('ORDER.EXPLORE_MENU', 'Khám phá thực đơn ngay')}</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
};
