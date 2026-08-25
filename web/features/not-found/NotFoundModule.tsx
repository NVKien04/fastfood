'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Home, Utensils, Package, Ticket, User, ArrowRight, Pizza, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const NotFoundModule = () => {
  const { t } = useTranslation();

  const quickLinks = [
    {
      title: t('NOT_FOUND_PAGE.ORDERS_LINK'),
      desc: t('NOT_FOUND_PAGE.ORDERS_DESC'),
      href: '/orders',
      icon: Package,
      badge: 'Order',
    },
    {
      title: t('NOT_FOUND_PAGE.VOUCHERS_LINK'),
      desc: t('NOT_FOUND_PAGE.VOUCHERS_DESC'),
      href: '/vouchers',
      icon: Ticket,
      badge: 'Deals',
    },
    {
      title: t('NOT_FOUND_PAGE.PROFILE_LINK'),
      desc: t('NOT_FOUND_PAGE.PROFILE_DESC'),
      href: '/profile',
      icon: User,
      badge: 'Account',
    },
  ];

  return (
    <div className="w-full max-w-300 mx-auto px-4 py-10 sm:py-16 flex flex-col items-center justify-center text-center transition-colors">
      {/* 1. Graphic & 404 Hero Illustration */}
      <div className="relative mb-6 sm:mb-8 select-none">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-orange-500/15 dark:bg-orange-500/20 blur-3xl rounded-full scale-150 pointer-events-none" />

        {/* Big stylized 404 Numbers with Pizza Center */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-4">
          <span className="text-7xl sm:text-9xl font-black text-gray-900 dark:text-white tracking-tighter drop-shadow-sm">
            4
          </span>

          {/* Center Pizza Icon / Graphic */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#ff6900] to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/30 animate-bounce duration-1000">
            <Pizza className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
          </div>

          <span className="text-7xl sm:text-9xl font-black text-gray-900 dark:text-white tracking-tighter drop-shadow-sm">
            4
          </span>
        </div>
      </div>

      {/* 2. Text Content */}
      <div className="max-w-xl mx-auto mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
          {t('NOT_FOUND_PAGE.TITLE')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
          {t(
            'NOT_FOUND_PAGE.SUBTITLE',
            'Trang bạn đang tìm kiếm có thể đã bị đổi tên, tạm thời không khả dụng hoặc đã bị đưa ra khỏi thực đơn.',
          )}
        </p>
      </div>

      {/* 3. Primary & Secondary CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
        <Link href="/">
          <Button className="h-12 px-6 sm:px-8 rounded-full bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#cc5200] text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 cursor-pointer flex items-center gap-2 transition-all">
            <Home className="w-4 h-4" />
            <span>{t('NOT_FOUND_PAGE.BACK_HOME')}</span>
          </Button>
        </Link>

        <Link href="/">
          <Button
            variant="outline"
            className="h-12 px-6 sm:px-8 rounded-full border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-2 shadow-xs transition-all"
          >
            <Utensils className="w-4 h-4 text-[#ff6900]" />
            <span>{t('NOT_FOUND_PAGE.EXPLORE_MENU')}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
