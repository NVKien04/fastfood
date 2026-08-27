'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { OrderResponseDto } from '@/services/apis/main/module/Order.api';
import { OrderProgressStepper } from './OrderProgressStepper';
import { formatVND } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Ban,
  FileText,
  Utensils,
  CheckCircle,
} from 'lucide-react';
import { canCancelOrder } from '../utils/order.utils';
import Link from 'next/link';

type OrderCardProps = {
  order: OrderResponseDto;
  onCancelClick: (order: OrderResponseDto) => void;
};

export const OrderCard = ({ order, onCancelClick }: OrderCardProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const canCancel = canCancelOrder(order.status);
  const isCancelled = order.status === 'CANCELLED';

  const getStatusBadge = () => {
    switch (order.status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {t('ORDER.STATUS_PENDING')}
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {t('ORDER.STATUS_CONFIRMED')}
          </span>
        );
      case 'PREPARING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            {t('ORDER.STATUS_PREPARING')}
          </span>
        );
      case 'READY_FOR_SHIPMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
            {t('ORDER.STATUS_SHIPPING')}
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            {t('ORDER.STATUS_DELIVERED')}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800">
            <Ban className="w-3.5 h-3.5" />
            {t('ORDER.STATUS_CANCELLED')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300">
            {order.status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
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
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800/80 shadow-xl shadow-gray-200/30 dark:shadow-black/30 overflow-hidden transition-all duration-300">
      {/* 1. Header Card */}
      <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white tracking-tight">
                #{order.orderNumber}
              </span>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] sm:text-xs text-gray-500 dark:text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Total & Quick Toggle */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-zinc-400">
              {t('ORDER.TOTAL_AMOUNT')}
            </div>
            <div className="text-base sm:text-lg font-black text-[#ff6900]">
              {formatVND(order.total)}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* 2. Stepper Progress Area */}
      <div className="px-5 sm:px-8 py-5 bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800">
        <OrderProgressStepper status={order.status} />
      </div>

      {/* 3. Expandable Details */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Order Items List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>{t('ORDER.ITEMS_LIST')}</span>
              {order.orderItems && <span>({order.orderItems.length})</span>}
            </h4>

            <div className="space-y-3">
              {order.orderItems && order.orderItems.length > 0 ? (
                order.orderItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/60 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.img ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 p-1 shrink-0 shadow-xs">
                          <Image
                            src={item.product.img}
                            alt={item.product.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500 shrink-0">
                          <Utensils className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                          {item.product?.name || t('ORDER.ITEM_UNKNOWN')}
                        </h5>
                        {item.productVariant && (
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                            {item.productVariant.name}
                            {item.productVariant.size ? ` (${item.productVariant.size})` : ''}
                            {item.productVariant.type ? ` - ${t('ORDER.CRUST_LABEL', { type: item.productVariant.type })}` : ''}
                          </p>
                        )}
                        {item.ingredients && item.ingredients.length > 0 && (
                          <p className="text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">
                            + {item.ingredients.map((ing) => ing.ingredient?.name || `Topping #${ing.ingredientId}`).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                        {formatVND(item.price * item.quantity)}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        x{item.quantity} ({formatVND(item.price)})
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 italic">
                  {t('ORDER.ITEMS_DETAIL_SUMMARY')}
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Payment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Info */}
            <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>{t('ORDER.DELIVERY_INFO')}</span>
              </h5>
              <div className="text-xs space-y-1 text-gray-700 dark:text-zinc-300">
                {order.guestName && (
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-semibold">{order.guestName}</span>
                  </div>
                )}
                {order.guestPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{order.guestPhone}</span>
                  </div>
                )}
                {order.guestAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                    <span className="leading-snug">{order.guestAddress}</span>
                  </div>
                )}
                {order.notes && (
                  <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 pt-1">
                    <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment & Price Summary */}
            <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                <span>{t('ORDER.PAYMENT_INFO')}</span>
              </h5>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>{t('ORDER.SUBTOTAL')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatVND(order.subTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>{t('ORDER.DELIVERY_FEE')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.deliveryFee === 0 ? t('ORDER.FREE') : formatVND(order.deliveryFee)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>{t('ORDER.DISCOUNT')}</span>
                    <span>-{formatVND(order.discount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-baseline">
                  <span className="font-black text-gray-900 dark:text-white">{t('ORDER.TOTAL')}</span>
                  <span className="text-base font-black text-[#ff6900]">{formatVND(order.total)}</span>
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
                  <span>{order.paymentMethod === 'ONLINE' ? t('ORDER.PAYMENT_ONLINE') : t('ORDER.PAYMENT_COD')}</span>
                  <span
                    className={`font-bold ${
                      order.paymentStatus === 'PAID'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {order.paymentStatus === 'PAID' ? t('ORDER.PAYMENT_PAID') : t('ORDER.PAYMENT_UNPAID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Info if Cancelled */}
          {isCancelled && order.cancelReason && (
            <div className="p-3 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400">
              <span className="font-bold">{t('ORDER.CANCEL_REASON_LABEL')}: </span>
              <span>{order.cancelReason}</span>
            </div>
          )}

          {/* Card Actions Footer */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-gray-400">
              {t('ORDER.SUPPORT_HOTLINE')} <a href="tel:19001822" className="font-bold text-[#ff6900] hover:underline">1900 1822</a>
            </div>

            <div className="flex items-center gap-2">
              {canCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onCancelClick(order)}
                  className="rounded-full text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/50 cursor-pointer"
                >
                  {t('ORDER.CANCEL_ORDER_BTN')}
                </Button>
              )}

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('ORDER.REORDER_BTN')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
