'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Truck,
  CheckCircle2,
  Clock,
  ChefHat,
  Ban,
  Utensils,
  Store,
  ChevronRight,
} from 'lucide-react';
import { OrderResponseDto } from '@/services/apis/main/module/Order.api';
import { formatVND } from '@/utils';
import { Button } from '@/components/ui/button';
import { canCancelOrder } from '../utils/order.utils';
import Link from 'next/link';

type OrderCardProps = {
  order: OrderResponseDto;
  onCancelClick: (order: OrderResponseDto) => void;
};

export const OrderCard = ({ order, onCancelClick }: OrderCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const canCancel = canCancelOrder(order.status);
  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';

  const getStatusDisplay = () => {
    switch (order.status) {
      case 'PENDING':
        return {
          icon: Clock,
          label: t('ORDER.STATUS_PENDING'),
          color: 'text-amber-600 dark:text-amber-400',
          badgeText: 'PENDING',
        };
      case 'CONFIRMED':
        return {
          icon: CheckCircle2,
          label: t('ORDER.STATUS_CONFIRMED'),
          color: 'text-blue-600 dark:text-blue-400',
          badgeText: 'CONFIRMED',
        };
      case 'PREPARING':
        return {
          icon: ChefHat,
          label: t('ORDER.STATUS_PREPARING'),
          color: 'text-purple-600 dark:text-purple-400',
          badgeText: 'PREPARING',
        };
      case 'READY_FOR_SHIPMENT':
        return {
          icon: Truck,
          label: t('ORDER.STATUS_SHIPPING'),
          color: 'text-indigo-600 dark:text-indigo-400',
          badgeText: 'SHIPPING',
        };
      case 'DELIVERED':
        return {
          icon: Truck,
          label: 'Giao hàng thành công',
          color: 'text-emerald-600 dark:text-emerald-400',
          badgeText: 'COMPLETED',
        };
      case 'CANCELLED':
        return {
          icon: Ban,
          label: t('ORDER.STATUS_CANCELLED'),
          color: 'text-red-600 dark:text-red-400',
          badgeText: 'CANCELLED',
        };
      default:
        return {
          icon: Clock,
          label: order.status,
          color: 'text-gray-600',
          badgeText: order.status,
        };
    }
  };

  const statusInfo = getStatusDisplay();
  const StatusIcon = statusInfo.icon;

  const handleCardClick = () => {
    router.push(`/orders/${order.id}`);
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 1. Header (Store badge / Order code & Delivery status) */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="bg-[#ff6900] text-white text-[11px] font-bold px-2 py-0.5 rounded">
            Yêu thích
          </span>
          <span className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
            <Store className="w-4 h-4 text-orange-500" />
            FastFood Express
          </span>
          <span className="text-gray-400 font-mono font-medium">#{order.orderNumber}</span>
        </div>

        <div className="flex items-center gap-2 font-medium">
          <div className={`flex items-center gap-1 text-xs ${statusInfo.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{statusInfo.label}</span>
          </div>
          <span className="text-gray-300 dark:text-zinc-700">|</span>
          <span className={`font-bold text-xs uppercase ${statusInfo.color}`}>
            {statusInfo.badgeText}
          </span>
        </div>
      </div>

      {/* 2. Body: Flat List of Items (Shopee Style) */}
      <div className="p-4 sm:p-5 space-y-4 divide-y divide-gray-100 dark:divide-zinc-800/80">
        {order.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.map((item, idx) => (
            <div key={item.id || idx} className={idx > 0 ? 'pt-4' : ''}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-800 p-1 shrink-0 border border-gray-100 dark:border-zinc-800 shadow-2xs">
                    {item.product?.img ? (
                      <Image
                        src={item.product.img}
                        alt={item.product.name}
                        fill
                        sizes="72px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Utensils className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                      {item.product?.name || t('ORDER.ITEM_UNKNOWN')}
                    </h4>

                    {(item.productVariant || (item.ingredients && item.ingredients.length > 0)) && (
                      <p className="text-xs text-gray-500 dark:text-zinc-400">
                        Phân loại:{' '}
                        {[
                          item.productVariant?.name,
                          item.ingredients?.map((i) => i.ingredient?.name).join(', '),
                        ]
                          .filter(Boolean)
                          .join(' + ')}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 font-medium">x{item.quantity}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                    {formatVND(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500 italic py-2">
            {t('ORDER.ITEMS_DETAIL_SUMMARY')}
          </div>
        )}
      </div>

      {/* 3. Footer (Order Total & Action buttons) */}
      <div className="p-4 sm:p-5 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
        <div className="text-xs text-gray-500 dark:text-zinc-400 hidden sm:block">
          {order.orderItems?.length || 0} sản phẩm
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-500 dark:text-zinc-400">Thành tiền:</span>
            <span className="text-lg sm:text-xl font-black text-[#ff6900]">
              {formatVND(order.total)}
            </span>
          </div>

          <div
            className="flex items-center gap-2 w-full sm:w-auto justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            {canCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onCancelClick(order)}
                className="rounded-lg text-xs font-semibold h-9 px-4 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5 mr-1" />
                {t('ORDER.CANCEL_ORDER')}
              </Button>
            )}

            {(isDelivered || isCancelled) && (
              <Link href="/">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs font-semibold h-9 px-4 cursor-pointer"
                >
                  Mua lại
                </Button>
              </Link>
            )}

            <Button
              type="button"
              size="sm"
              onClick={handleCardClick}
              className="rounded-lg text-xs font-bold h-9 px-5 bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-xs cursor-pointer"
            >
              <span>Xem chi tiết đơn</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
