'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import {
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  Ban,
  Receipt,
  Utensils,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { OrderResponseDto } from '@/services/apis/main/module/Order.api';
import { OrderProgressStepper } from './OrderProgressStepper';
import { formatVND } from '@/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { canCancelOrder } from '../utils/order.utils';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponseDto | null;
  onCancelClick?: (order: OrderResponseDto) => void;
}

export const OrderDetailModal = ({ isOpen, onClose, order, onCancelClick }: OrderDetailModalProps) => {
  const { t } = useTranslation();

  if (!order) return null;

  const canCancel = canCancelOrder(order.status);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-3xl">
        {/* Header */}
        <DialogHeader className="p-5 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex flex-row items-center justify-between sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                {t('ORDER.DETAIL_TITLE', { defaultValue: 'Chi tiết đơn hàng' })} #{order.orderNumber}
              </DialogTitle>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(order.createdAt)}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Stepper Progress */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
            <OrderProgressStepper status={order.status} />
          </div>

          {/* Delivery Info */}
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{t('ORDER.DELIVERY_INFO')}</span>
            </h4>
            <div className="text-xs space-y-1.5 text-gray-700 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-900 dark:text-white">{order.guestName || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{order.guestPhone || '—'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {order.guestAddress ||
                    t('ORDER.NO_ADDRESS_GIVEN', { defaultValue: 'Nhận tại quầy / Chưa nhập địa chỉ' })}
                </span>
              </div>
              {order.notes && (
                <div className="flex items-start gap-2 pt-2 border-t border-gray-200/60 dark:border-zinc-700/60 text-amber-700 dark:text-amber-300">
                  <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="italic">Ghi chú: {order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-orange-500" />
              <span>{t('ORDER.ITEMS_LIST')}</span>
              {order.orderItems && <span>({order.orderItems.length})</span>}
            </h4>

            <div className="space-y-3">
              {order.orderItems?.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-start justify-between p-3.5 rounded-2xl bg-gray-50/70 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 p-1 shrink-0 border border-gray-100 dark:border-zinc-800 shadow-2xs">
                      {item.product?.img ? (
                        <Image
                          src={item.product.img}
                          alt={item.product.name}
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Utensils className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h5 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white truncate">
                        {item.product?.name || t('ORDER.ITEM_UNKNOWN')}
                      </h5>
                      {item.productVariant && (
                        <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                          {item.productVariant.name}
                          {item.productVariant.size ? ` (${item.productVariant.size})` : ''}
                        </p>
                      )}
                      {item.ingredients && item.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {item.ingredients.map((ing, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-0.5 text-[10px] bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded font-medium"
                            >
                              <Sparkles className="w-2.5 h-2.5" />+
                              {ing.ingredient?.name || `Topping #${ing.ingredientId}`}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] text-gray-400 pt-0.5">
                        x{item.quantity} ({formatVND(item.price)})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-black text-[#ff6900]">
                      {formatVND(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Price Breakdown */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-orange-500" />
              <span>{t('ORDER.PAYMENT_INFO', { defaultValue: 'Chi tiết thanh toán' })}</span>
            </h4>

            <div className="text-xs space-y-2 text-gray-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span>{t('ORDER.SUBTOTAL', { defaultValue: 'Tạm tính' })}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatVND(order.subTotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('ORDER.SHIPPING_FEE', { defaultValue: 'Phí vận chuyển' })}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {order.deliveryFee > 0 ? formatVND(order.deliveryFee) : 'Miễn phí'}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>{t('ORDER.DISCOUNT', { defaultValue: 'Giảm giá' })}</span>
                  <span className="font-semibold">-{formatVND(order.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-center text-sm font-black text-gray-900 dark:text-white">
                <span>{t('ORDER.TOTAL_AMOUNT')}</span>
                <span className="text-[#ff6900] text-base">{formatVND(order.total)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px] text-gray-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  {order.paymentMethod || 'COD'}
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 sm:p-5 border-t border-gray-100 dark:border-zinc-800 flex flex-row items-center justify-between sm:justify-between bg-white dark:bg-zinc-900">
          <div>
            {canCancel && onCancelClick && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  onClose();
                  onCancelClick(order);
                }}
                className="rounded-full text-xs font-bold gap-1.5 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{t('ORDER.CANCEL_ORDER')}</span>
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full text-xs font-bold px-6 cursor-pointer"
          >
            {t('COMMON.CLOSE')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
