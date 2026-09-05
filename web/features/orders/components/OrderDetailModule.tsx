'use client';

import { use, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
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
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { Loading } from '@/components/Loading';
import { useOrderDetail } from '@/services/react-query/queries/order';
import { useCancelOrder } from '@/services/react-query/mutations/order';
import { OrderProgressStepper } from './OrderProgressStepper';
import { OrderCancelModal } from './OrderCancelModal';
import { formatVND } from '@/utils';
import { Button } from '@/components/ui/button';
import { canCancelOrder } from '../utils/order.utils';

interface OrderDetailModuleProps {
  params: Promise<{ id: string }>;
}

export const OrderDetailModule = ({ params }: OrderDetailModuleProps) => {
  const { id } = use(params);
  const { t } = useTranslation();
  const router = useRouter();

  const { data: order, isLoading, refetch, isFetching } = useOrderDetail(id);
  const cancelOrderMutation = useCancelOrder();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const canCancel = order ? canCancelOrder(order.status) : false;
  const isDelivered = order?.status === 'DELIVERED';
  const isCancelled = order?.status === 'CANCELLED';

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

  const handleConfirmCancel = async (reason: string) => {
    if (!order) return;
    try {
      await cancelOrderMutation.mutateAsync({
        id: order.id,
        reason,
      });
      setIsCancelModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  if (isLoading) {
    return <Loading text={t('ORDER.LOADING_ORDERS', { defaultValue: 'Đang tải chi tiết đơn hàng...' })} />;
  }

  if (!order) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">
          {t('COMMON.NO_DATA', { defaultValue: 'Không tìm thấy đơn hàng' })}
        </h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
          Đơn hàng không tồn tại hoặc bạn không có quyền truy cập đơn hàng này.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push('/orders')}
          className="rounded-full gap-2 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('ORDER.BACK_TO_ORDERS', { defaultValue: 'Quay lại danh sách đơn hàng' })}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* 1. Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push('/orders')}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700 dark:text-zinc-300" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('ORDER.DETAIL_TITLE', { defaultValue: 'Chi tiết đơn hàng' })} #{order.orderNumber}
              </h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Đặt lúc {formatDate(order.createdAt)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-full gap-1.5 text-xs font-bold cursor-pointer h-9 px-4"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{t('COMMON.REFRESH', { defaultValue: 'Làm mới' })}</span>
          </Button>

          {canCancel && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="rounded-full text-xs font-bold gap-1.5 cursor-pointer h-9 px-4"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>{t('ORDER.CANCEL_ORDER')}</span>
            </Button>
          )}

          {(isDelivered || isCancelled) && (
            <Link href="/">
              <Button
                type="button"
                size="sm"
                className="rounded-full text-xs font-bold bg-[#ff6900] hover:bg-[#e05d00] text-white cursor-pointer h-9 px-5 shadow-xs"
              >
                Mua lại món
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Progress Stepper Card */}
      <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-4 flex items-center gap-1.5">
          <Package className="w-4 h-4 text-orange-500" />
          <span>Tiến trình đơn hàng</span>
        </h3>
        <div className="pt-2 pb-3 max-w-5xl mx-auto px-4 sm:px-8">
          <OrderProgressStepper status={order.status} />
        </div>
      </div>

      {/* 3. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-orange-500" />
                <span>{t('ORDER.ITEMS_LIST')}</span>
              </span>
              <span className="text-gray-400 font-semibold lowercase">
                {order.orderItems?.length || 0} món
              </span>
            </h3>

            <div className="space-y-3.5 divide-y divide-gray-100 dark:divide-zinc-800/80">
              {order.orderItems?.map((item, idx) => (
                <div key={item.id || idx} className={idx > 0 ? 'pt-3.5' : ''}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-800 p-1 shrink-0 border border-gray-100 dark:border-zinc-800 shadow-2xs">
                        {item.product?.img ? (
                          <Image
                            src={item.product.img}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Utensils className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-black text-gray-900 dark:text-white leading-snug">
                          {item.product?.name || t('ORDER.ITEM_UNKNOWN')}
                        </h4>
                        {item.productVariant && (
                          <p className="text-xs text-gray-500 dark:text-zinc-400">
                            Phân loại: {item.productVariant.name}
                            {item.productVariant.size ? ` (${item.productVariant.size})` : ''}
                          </p>
                        )}
                        {item.ingredients && item.ingredients.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {item.ingredients.map((ing, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-0.5 text-[10px] bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                +{ing.ingredient?.name || `Topping #${ing.ingredientId}`}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 font-medium pt-0.5">
                          Số lượng: <strong className="text-gray-900 dark:text-white">x{item.quantity}</strong> ({formatVND(item.price)})
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-black text-[#ff6900]">
                        {formatVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {order.notes && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Ghi chú của bạn:</strong>
                  <p className="mt-0.5 leading-relaxed">{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Delivery & Payment Details */}
        <div className="space-y-6">
          {/* Delivery Card */}
          <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{t('ORDER.DELIVERY_INFO')}</span>
            </h3>

            <div className="text-xs space-y-2 text-gray-700 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-bold text-gray-900 dark:text-white">
                  {order.guestName || 'Khách hàng'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-semibold text-primary">{order.guestPhone || '—'}</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {order.guestAddress || 'Nhận tại cửa hàng'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown Card */}
          <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-orange-500" />
              <span>{t('ORDER.PAYMENT_INFO', { defaultValue: 'Chi tiết thanh toán' })}</span>
            </h3>

            <div className="text-xs space-y-2 text-gray-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span>{t('ORDER.SUBTOTAL', { defaultValue: 'Tạm tính' })}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatVND(order.subTotal || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('ORDER.SHIPPING_FEE', { defaultValue: 'Phí vận chuyển' })}</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {order.deliveryFee > 0 ? formatVND(order.deliveryFee) : 'Miễn phí'}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>{t('ORDER.DISCOUNT', { defaultValue: 'Giảm giá' })}</span>
                  <span className="font-bold">-{formatVND(order.discount)}</span>
                </div>
              )}
              <div className="pt-2.5 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center text-sm font-black text-gray-900 dark:text-white">
                <span>{t('ORDER.TOTAL_AMOUNT')}</span>
                <span className="text-[#ff6900] text-lg font-black">{formatVND(order.total)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-[11px] text-gray-500 dark:text-zinc-400 border-t border-dashed border-gray-100 dark:border-zinc-800">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  {order.paymentMethod || 'COD'}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <OrderCancelModal
          isOpen={isCancelModalOpen}
          orderNumber={order.orderNumber}
          isLoading={cancelOrderMutation.isPending}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
};
