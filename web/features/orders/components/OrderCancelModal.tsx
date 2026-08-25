'use client';

import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderCancelModalProps = {
  isOpen: boolean;
  orderNumber: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const CANCEL_REASONS: { key: string; txKey: string }[] = [
  { key: 'CHANGE_MIND', txKey: 'ORDER.REASON_CHANGE_MIND' },
  { key: 'WRONG_ITEM', txKey: 'ORDER.REASON_WRONG_ITEM' },
  { key: 'LONG_WAIT', txKey: 'ORDER.REASON_LONG_WAIT' },
  { key: 'FOUND_BETTER', txKey: 'ORDER.REASON_FOUND_BETTER' },
  { key: 'OTHER', txKey: 'ORDER.REASON_OTHER' },
];

export const OrderCancelModal = ({
  isOpen,
  orderNumber,
  isLoading,
  onClose,
  onConfirm,
}: OrderCancelModalProps) => {
  const { t } = useTranslation();
  const [selectedReasonKey, setSelectedReasonKey] = useState<string>(CANCEL_REASONS[0].key);
  const [customReason, setCustomReason] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedReasonKey === 'OTHER') {
      onConfirm(customReason.trim() || t('ORDER.DEFAULT_CANCEL_REASON'));
      return;
    }
    const matched = CANCEL_REASONS.find((r) => r.key === selectedReasonKey);
    onConfirm(matched ? t(matched.txKey) : t('ORDER.DEFAULT_CANCEL_REASON'));
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
              {CANCEL_REASONS.map((item) => {
                const isSelected = selectedReasonKey === item.key;
                return (
                  <label
                    key={item.key}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all',
                      isSelected
                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-200'
                        : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-700 dark:text-zinc-300',
                    )}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={item.key}
                      checked={isSelected}
                      onChange={() => setSelectedReasonKey(item.key)}
                      className="accent-orange-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{t(item.txKey)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {selectedReasonKey === 'OTHER' && (
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isLoading}
              onClick={onClose}
              className="rounded-full text-xs font-bold cursor-pointer"
            >
              {t('COMMON.CLOSE')}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isLoading}
              className="rounded-full text-xs font-bold gap-2 cursor-pointer shadow-md shadow-red-600/20"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{t('ORDER.CONFIRM_CANCEL_BTN')}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

