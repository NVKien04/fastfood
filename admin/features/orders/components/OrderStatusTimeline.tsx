'use client';

import { useTranslation } from 'react-i18next';
import { Check, Clock, ChefHat, Truck, PackageCheck, AlertOctagon } from 'lucide-react';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';
import { ORDER_TIMELINE_STEPS } from '../utils/order.utils';
import { cn } from '@/lib/utils';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  notes?: string | null;
}

const getStepIcon = (status: OrderStatus, isCompleted: boolean) => {
  if (isCompleted) {
    return <Check className="h-4 w-4 stroke-[3]" />;
  }
  switch (status) {
    case OrderStatus.PENDING:
      return <Clock className="h-4 w-4" />;
    case OrderStatus.CONFIRMED:
      return <Check className="h-4 w-4" />;
    case OrderStatus.PREPARING:
      return <ChefHat className="h-4 w-4" />;
    case OrderStatus.READY_FOR_SHIPMENT:
      return <Truck className="h-4 w-4" />;
    case OrderStatus.DELIVERED:
      return <PackageCheck className="h-4 w-4" />;
    default:
      return null;
  }
};

export const OrderStatusTimeline = ({
  currentStatus,
  notes,
}: OrderStatusTimelineProps) => {
  const { t } = useTranslation();

  if (currentStatus === OrderStatus.CANCELLED) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/20 rounded-full text-destructive">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-destructive">{t('ORDERS.CANCELLED')}</h3>
            <p className="text-sm text-destructive/80 mt-0.5">
              Đơn hàng này đã bị hủy và không thể xử lý tiếp.
            </p>
          </div>
        </div>
        {notes && (
          <div className="mt-3 pt-3 border-t border-destructive/20 text-xs text-muted-foreground whitespace-pre-line">
            {notes}
          </div>
        )}
      </div>
    );
  }

  const currentIndex = ORDER_TIMELINE_STEPS.indexOf(currentStatus);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Connection line background */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-muted -z-0" />

        {/* Completed connection line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-0"
          style={{
            width:
              currentIndex <= 0
                ? '0%'
                : `${(currentIndex / (ORDER_TIMELINE_STEPS.length - 1)) * 100}%`,
          }}
        />

        {ORDER_TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step} className="flex flex-col items-center z-10">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-2xs',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  isCurrent &&
                    'border-primary bg-background text-primary ring-4 ring-primary/20 scale-110 font-bold',
                  isUpcoming && 'border-muted-foreground/30 bg-muted text-muted-foreground',
                )}
              >
                {getStepIcon(step, isCompleted)}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium text-center max-w-[90px] transition-colors',
                  isCurrent && 'text-primary font-bold',
                  isCompleted && 'text-foreground',
                  isUpcoming && 'text-muted-foreground',
                )}
              >
                {t(`ORDERS.${step}`)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
