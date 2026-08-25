'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface OrderCancelModalProps {
  isOpen: boolean;
  orderNumber: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const COMMON_REASONS = [
  'Tôi muốn đổi món / đổi địa chỉ',
  'Tôi đặt nhầm món ăn',
  'Thời gian giao hàng quá lâu',
  'Tôi tìm được ưu đãi tốt hơn',
  'Lý do khác',
];

export const OrderCancelModal = ({
  isOpen,
  orderNumber,
  isLoading,
  onClose,
  onConfirm,
}: OrderCancelModalProps) => {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Lý do khác' ? customReason.trim() : selectedReason;
    onConfirm(finalReason || 'Khách hàng yêu cầu hủy đơn');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <DialogTitle className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              {t('ORDER.CANCEL_CONFIRM_TITLE')}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-zinc-400">
              {t('ORDER.CANCEL_CONFIRM_DESC')} <span className="font-bold text-gray-900 dark:text-white">#{orderNumber}</span>
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-2">
              {t('ORDER.SELECT_CANCEL_REASON')}
            </label>
            <div className="space-y-2">
              {COMMON_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-200'
                      : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-700 dark:text-zinc-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-orange-500 w-4 h-4"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Lý do khác' && (
            <div>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={t('ORDER.CUSTOM_REASON_PLACEHOLDER')}
                rows={3}
                required
                className="w-full text-xs p-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {t('COMMON.CLOSE')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t('ORDER.CONFIRM_CANCEL_BTN')}</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
