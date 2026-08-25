'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Clock, AlertCircle, XCircle } from 'lucide-react';
import { formatVND } from '@/utils';

export type VoucherType = 'ALL' | 'DISCOUNT' | 'FREESHIP' | 'FOOD';

export interface VoucherItem {
  code: string;
  name: string;
  description: string;
  type: 'DISCOUNT' | 'FREESHIP' | 'FOOD';
  discountAmount: number;
  minOrderAmount: number;
  expiryDate: string;
}

const MOCK_VOUCHERS: VoucherItem[] = [
  {
    code: 'WELCOMEPIZZA',
    name: 'Tặng 01 Pizza Thịt và Xúc Xích - Đế Dày - Cỡ Vừa (M)',
    description: 'Chúc mừng bạn đã đăng nhập Ứng dụng thành công. Áp dụng cho đơn từ 150.000đ.',
    type: 'FOOD',
    discountAmount: 89000,
    minOrderAmount: 150000,
    expiryDate: '27/09/2026',
  },
  {
    code: 'KEI50K',
    name: 'Giảm 50.000 đ cho đơn hàng tiệc gia đình',
    description: 'Áp dụng cho toàn bộ thực đơn khi đạt giá trị đơn tối thiểu từ 250.000đ.',
    type: 'DISCOUNT',
    discountAmount: 50000,
    minOrderAmount: 250000,
    expiryDate: '30/10/2026',
  },
  {
    code: 'FREESHIPMAX',
    name: 'Miễn phí giao hàng (Freeship tối đa 30.000 đ)',
    description: 'Hỗ trợ 100% phí giao hàng tận nơi cho đơn hàng từ 120.000đ.',
    type: 'FREESHIP',
    discountAmount: 30000,
    minOrderAmount: 120000,
    expiryDate: '15/11/2026',
  },
  {
    code: 'KEI20K',
    name: 'Giảm 20.000 đ cho đơn hàng bất kỳ',
    description: 'Ưu đãi dành riêng cho khách hàng thân thiết Kei Rewards.',
    type: 'DISCOUNT',
    discountAmount: 20000,
    minOrderAmount: 100000,
    expiryDate: '31/12/2026',
  },
  {
    code: 'DRINKFREE',
    name: 'Tặng 02 Đồ uống bất kỳ (Coca / Sprite / Fanta)',
    description: 'Áp dụng khi mua kèm Pizza cỡ lớn hoặc Combo bất kỳ.',
    type: 'FOOD',
    discountAmount: 40000,
    minOrderAmount: 180000,
    expiryDate: '31/12/2026',
  },
];

type VoucherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subTotal: number;
  appliedCode?: string;
  onSelectVoucher: (voucher: VoucherItem | null) => void;
};

export const VoucherModal = ({ isOpen, onClose, subTotal, appliedCode = '', onSelectVoucher }: VoucherModalProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<VoucherType>('ALL');
  const [inputCode, setInputCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedCode, setSelectedCode] = useState<string>(appliedCode);

  const filteredVouchers = useMemo(() => {
    if (activeTab === 'ALL') return MOCK_VOUCHERS;
    return MOCK_VOUCHERS.filter((v) => v.type === activeTab);
  }, [activeTab]);

  if (!isOpen) return null;

  const handleApplyInputCode = () => {
    setErrorMsg('');
    const trimmed = inputCode.trim().toUpperCase();
    if (!trimmed) {
      setErrorMsg(t('VOUCHER.ERR_ENTER_CODE'));
      return;
    }

    const found = MOCK_VOUCHERS.find((v) => v.code.toUpperCase() === trimmed);
    if (!found) {
      setErrorMsg(t('VOUCHER.ERR_NOT_FOUND'));
      return;
    }

    if (subTotal < found.minOrderAmount) {
      setErrorMsg(
        t('VOUCHER.ERR_MIN_ORDER', {
          amount: formatVND(found.minOrderAmount),
          defaultValue: `Đơn hàng chưa đạt giá trị tối thiểu ${formatVND(found.minOrderAmount)} để dùng mã này.`,
        }),
      );
      return;
    }

    setSelectedCode(found.code);
    onSelectVoucher(found);
  };

  const handleToggleSelect = (voucher: VoucherItem) => {
    if (subTotal < voucher.minOrderAmount) return;

    if (selectedCode === voucher.code) {
      setSelectedCode('');
    } else {
      setSelectedCode(voucher.code);
    }
  };

  const handleConfirm = () => {
    if (selectedCode) {
      const found = MOCK_VOUCHERS.find((v) => v.code === selectedCode);
      onSelectVoucher(found || null);
    } else {
      onSelectVoucher(null);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-[480px] rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-wide uppercase">
            {t('VOUCHER.TITLE')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('COMMON.CLOSE')}
            className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Apply Bar */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={t('VOUCHER.ENTER_CODE_PLACEHOLDER')}
                className="w-full h-11 px-4 pr-9 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyInputCode();
                }}
              />
              {inputCode && (
                <button
                  type="button"
                  onClick={() => setInputCode('')}
                  aria-label={t('COMMON.DELETE')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleApplyInputCode}
              disabled={!inputCode.trim()}
              className="h-11 px-5 rounded-xl font-bold text-sm transition-all cursor-pointer disabled:bg-gray-100 dark:disabled:bg-zinc-800 disabled:text-gray-400 dark:disabled:text-zinc-600 disabled:cursor-not-allowed bg-[#ff6900] hover:bg-[#e05d00] text-white active:scale-95 shadow-xs"
            >
              {t('COMMON.APPLY')}
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Section Label & Filter Tabs */}
        <div className="px-6 pt-2 pb-2">
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 mb-2.5">
            {t('VOUCHER.OR_SELECT_VOUCHER')}
          </p>

          {/* Type Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            {[
              { id: 'ALL', label: t('VOUCHER.TAB_ALL') },
              { id: 'DISCOUNT', label: t('VOUCHER.TAB_DISCOUNT') },
              { id: 'FREESHIP', label: t('VOUCHER.TAB_FREESHIP') },
              { id: 'FOOD', label: t('VOUCHER.TAB_FOOD') },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as VoucherType)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#ff6900] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Voucher List */}
        <div className="px-6 py-2 overflow-y-auto flex-1 space-y-3 max-h-[380px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
          {filteredVouchers.map((voucher) => {
            const isEligible = subTotal >= voucher.minOrderAmount;
            const isSelected = selectedCode === voucher.code;

            return (
              <div
                key={voucher.code}
                onClick={() => handleToggleSelect(voucher)}
                className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#ff6900] bg-orange-50/20 dark:bg-orange-950/20 shadow-xs ring-1 ring-[#ff6900]/30'
                    : isEligible
                      ? 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-300 dark:hover:border-zinc-700'
                      : 'border-gray-100 dark:border-zinc-800/60 bg-gray-50/50 dark:bg-zinc-950/40 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Primary Ticket Icon with Star & Notches */}
                <div className="w-11 h-8 rounded-sm bg-[#ff6900] text-white shrink-0 flex items-center justify-center relative shadow-xs">
                  {/* Left & Right cutouts for ticket look */}
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white dark:bg-zinc-900" />
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white dark:bg-zinc-900" />

                  {/* Star Icon in center */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-1">
                    {voucher.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                    {voucher.description}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500 dark:text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{voucher.expiryDate}</span>

                    {!isEligible && (
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 ml-1">
                        (
                        {t('VOUCHER.BUY_MORE_TO_APPLY', {
                          amount: formatVND(voucher.minOrderAmount - subTotal),
                          defaultValue: `Mua thêm ${formatVND(voucher.minOrderAmount - subTotal)}`,
                        })}
                        )
                      </span>
                    )}
                  </div>
                </div>

                {/* Radio Button */}
                <div className="shrink-0 pl-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-[#ff6900] bg-[#ff6900]'
                        : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with "Xong" Button */}
        <div className="p-6 pt-4">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full h-12 rounded-2xl bg-[#ff6900] hover:bg-[#e05d00] active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center cursor-pointer"
          >
            {t('COMMON.DONE')}
          </button>
        </div>
      </div>
    </div>
  );
};
