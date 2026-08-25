'use client';

import { useTranslation } from 'react-i18next';
import { useMyOrders, OrderFilterTab } from './hooks/useMyOrders';
import { OrderCard } from './components/OrderCard';
import { OrderCancelModal } from './components/OrderCancelModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Package, Search, ShoppingBag, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const MyOrders = () => {
  const { t } = useTranslation();
  const {
    orders,
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    countByTab,
    cancellingOrder,
    isCancelLoading,
    handleOpenCancelModal,
    handleCloseCancelModal,
    handleConfirmCancel,
    refetch,
  } = useMyOrders();

  const tabs: { key: OrderFilterTab; label: string }[] = [
    { key: 'ALL', label: t('ORDER.TAB_ALL') },
    { key: 'PROCESSING', label: t('ORDER.TAB_PROCESSING') },
    { key: 'DELIVERED', label: t('ORDER.TAB_DELIVERED') },
    { key: 'CANCELLED', label: t('ORDER.TAB_CANCELLED') },
  ];

  return (
    <div className="w-full max-w-300 mx-auto px-4 py-6 sm:py-10 transition-colors">
      {/* 1. Header Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Package className="w-7 h-7 text-[#ff6900]" />
            <span>{t('ORDER.PAGE_TITLE')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            {t('ORDER.PAGE_SUBTITLE')}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => refetch()}
          className="rounded-full gap-2 text-xs font-bold cursor-pointer"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
          <span>{t('COMMON.REFRESH')}</span>
        </Button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Tabs Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {tabs.map((tab) => {
            const count = countByTab[tab.key];
            const isActive = activeTab === tab.key;
            return (
              <Button
                key={tab.key}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer h-auto',
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-[#ff6900] shadow-xs hover:bg-white dark:hover:bg-zinc-900'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white',
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded-full text-[10px] font-extrabold',
                    isActive
                      ? 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
                      : 'bg-gray-200/60 dark:bg-zinc-700/60 text-gray-500 dark:text-zinc-400',
                  )}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Search by Order Code */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('ORDER.SEARCH_PLACEHOLDER')}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-xs"
          />
        </div>
      </div>

      {/* 3. Orders List or Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff6900] mb-3" />
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            {t('ORDER.LOADING_ORDERS')}
          </p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancelClick={handleOpenCancelModal} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 border border-gray-100 dark:border-zinc-800 text-center shadow-xl shadow-gray-200/20 dark:shadow-black/20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
            {t('ORDER.EMPTY_TITLE')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-sm mb-6">
            {t('ORDER.EMPTY_DESC')}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs sm:text-sm font-black shadow-lg shadow-orange-500/25 active:scale-95 transition-all"
          >
            <span>{t('ORDER.EXPLORE_MENU')}</span>
            <span>→</span>
          </Link>
        </div>
      )}

      {/* 4. Order Cancellation Modal */}
      {cancellingOrder && (
        <OrderCancelModal
          isOpen={!!cancellingOrder}
          orderNumber={cancellingOrder.orderNumber}
          isLoading={isCancelLoading}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};
