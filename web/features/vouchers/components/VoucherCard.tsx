'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CouponItemDto } from '@/services/apis/main/module/Coupon.api';
import { formatVND } from '@/utils';
import {
  Ticket,
  Copy,
  Check,
  Sparkles,
  Truck,
  Percent,
  Clock,
  Crown,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface VoucherCardProps {
  voucher: CouponItemDto;
}

export const VoucherCard = ({ voucher }: VoucherCardProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<boolean>(false);

  const isFreeship = voucher.code.includes('FREESHIP') || voucher.name.toLowerCase().includes('freeship');
  const isExclusive = voucher.isExclusive || voucher.code.includes('VIP') || voucher.code.includes('BIRTHDAY');
  const isUsed = voucher.isUsed;

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
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

  return (
    <div
      className={`group relative flex flex-col sm:flex-row rounded-3xl border transition-all duration-300 overflow-hidden shadow-lg ${
        isUsed
          ? 'bg-gray-100/70 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 opacity-60'
          : isExclusive
            ? 'bg-gradient-to-br from-amber-500/5 via-white to-orange-500/10 dark:from-amber-950/20 dark:via-zinc-900 dark:to-orange-950/20 border-amber-200/80 dark:border-amber-800/60 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-600'
            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:border-orange-300 dark:hover:border-zinc-700'
      }`}
    >
      {/* 1. Left Badge Column (Ticket Stub Style) */}
      <div
        className={`sm:w-36 p-5 sm:p-6 flex flex-col items-center justify-center text-center relative shrink-0 ${
          isUsed
            ? 'bg-gray-200 dark:bg-zinc-800 text-gray-500'
            : isExclusive
              ? 'bg-gradient-to-b from-amber-500 to-orange-500 text-white'
              : isFreeship
                ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white'
                : 'bg-gradient-to-b from-orange-500 to-red-500 text-white'
        }`}
      >
        {/* Subtle pattern or icon */}
        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2 shadow-xs">
          {isExclusive ? (
            <Crown className="w-5 h-5" />
          ) : isFreeship ? (
            <Truck className="w-5 h-5" />
          ) : (
            <Percent className="w-5 h-5" />
          )}
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
          {isFreeship ? 'FREESHIP' : 'GIẢM GIÁ'}
        </span>
        <div className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
          {formatVND(voucher.value)}
        </div>

        {/* Exclusive pill */}
        {isExclusive && (
          <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-amber-700 font-extrabold text-[9px] shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
            <span>VIP ONLY</span>
          </span>
        )}
      </div>

      {/* 2. Middle Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-[#ff6900] border border-orange-200 dark:border-orange-800/60 tracking-wider">
                {voucher.code}
              </span>
              {isUsed && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">
                  {t('VOUCHER.USED')}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-zinc-400">
              <Clock className="w-3.5 h-3.5" />
              <span>HSD: {formatDate(voucher.endDate)}</span>
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-[#ff6900] transition-colors">
            {voucher.name}
          </h3>

          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {voucher.description || t('VOUCHER.DEFAULT_DESC')}
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-300">
            <span className="text-gray-400 font-normal">{t('VOUCHER.MIN_ORDER_LABEL')}:</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {voucher.minOrderAmount === 0
                ? t('VOUCHER.NO_MIN')
                : formatVND(voucher.minOrderAmount)}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyCode}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t('VOUCHER.COPIED') : t('VOUCHER.COPY_CODE')}</span>
          </button>

          {/* Use Now Link */}
          {!isUsed && (
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black text-white bg-[#ff6900] hover:bg-[#e05d00] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>{t('VOUCHER.USE_NOW')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
