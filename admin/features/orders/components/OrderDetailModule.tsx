'use client';

import { use, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Printer,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';
import {
  getValidNextTransitions,
  canCancelOrder,
  formatOrderDateTime,
} from '../utils/order.utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { OrderItemsTable } from './OrderItemsTable';
import { OrderCustomerInfo } from './OrderCustomerInfo';
import { OrderPaymentInfo } from './OrderPaymentInfo';
import { UpdateStatusDialog } from './UpdateStatusDialog';
import { CancelOrderDialog } from './CancelOrderDialog';
import { PrintReceiptDialog } from './PrintReceiptDialog';

interface OrderDetailModuleProps {
  params: Promise<{ id: string }>;
}

export const OrderDetailModule = ({ params }: OrderDetailModuleProps) => {
  const { id } = use(params);
  const { t } = useTranslation();
  const router = useRouter();

  const { order, isLoading, isFetching, refetch } = useOrderDetail(id);
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  // State for modals
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-44" />
        </div>
        <Card className="border-border/60">
          <CardContent className="p-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <h2 className="text-lg font-semibold">{t('COMMON.NO_DATA')}</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Không tìm thấy thông tin đơn hàng với mã ID này.
        </p>
        <Button variant="outline" onClick={() => router.push('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('ORDERS.BACK_TO_ORDERS')}
        </Button>
      </div>
    );
  }

  const nextTransitions = getValidNextTransitions(order.status);
  const isCancellable = canCancelOrder(order.status);

  const handleConfirmStatusChange = async (_: string, newStatus: OrderStatus) => {
    await updateStatusMutation.mutateAsync({ id: order.id, status: newStatus });
  };

  const handleConfirmCancel = async (_: string, reason?: string) => {
    await cancelOrderMutation.mutateAsync({ id: order.id, reason });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/orders')}
            className="h-9 w-9 rounded-full border shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">
                {t('ORDERS.DETAIL')} #{order.orderNumber}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tạo lúc {formatOrderDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintModalOpen(true)}
            className="gap-1.5"
          >
            <Printer className="h-4 w-4" />
            <span>{t('ORDERS.PRINT_RECEIPT')}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>

          {nextTransitions.map((tItem) => (
            <Button
              key={tItem.nextStatus}
              size="sm"
              onClick={() => setTargetStatus(tItem.nextStatus)}
              className="gap-1.5 shadow-xs"
            >
              <span>{tItem.label}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ))}

          {isCancellable && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="gap-1.5 shadow-xs"
            >
              <Ban className="h-4 w-4" />
              <span>{t('ORDERS.CANCEL_ORDER')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Order Progression Timeline */}
      <Card className="border-border/60 shadow-2xs">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-base font-semibold">
            {t('ORDERS.ORDER_TIMELINE')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="max-w-5xl mx-auto py-1 px-4 sm:px-8">
            <OrderStatusTimeline
              currentStatus={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
              notes={order.notes}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-2xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>{t('ORDERS.ITEMS')}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {order.orderItems?.length || 0} món
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0 sm:p-4">
              <OrderItemsTable items={order.orderItems} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer Info & Payment Breakdown */}
        <div className="space-y-6">
          <OrderCustomerInfo order={order} />
          <OrderPaymentInfo order={order} />
        </div>
      </div>

      {/* Modals */}
      <UpdateStatusDialog
        isOpen={Boolean(targetStatus)}
        onClose={() => setTargetStatus(null)}
        order={order}
        targetStatus={targetStatus}
        onConfirm={handleConfirmStatusChange}
        isLoading={updateStatusMutation.isPending}
      />

      <CancelOrderDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        order={order}
        onConfirm={handleConfirmCancel}
        isLoading={cancelOrderMutation.isPending}
      />

      <PrintReceiptDialog
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        order={order}
      />
    </div>
  );
};
