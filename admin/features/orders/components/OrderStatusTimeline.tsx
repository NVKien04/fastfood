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

const renderStepIcon = (status: OrderStatus) => {
  const iconProps = { className: 'h-4 w-4' };
  switch (status) {
    case OrderStatus.PENDING:
      return <Clock {...iconProps} />;
    case OrderStatus.CONFIRMED:
      return <Check {...iconProps} />;
    case OrderStatus.PREPARING:
      return <ChefHat {...iconProps} />;
    case OrderStatus.READY_FOR_SHIPMENT:
      return <Truck {...iconProps} />;
    case OrderStatus.DELIVERED:
      return <PackageCheck {...iconProps} />;
    default:
      return <Clock {...iconProps} />;
  }
};

export const OrderStatusTimeline = ({ currentStatus, notes }: OrderStatusTimelineProps) => {
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
            <p className="text-sm text-destructive/80 mt-0.5">Đơn hàng này đã bị hủy và không thể xử lý tiếp.</p>
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
    <div className="w-full overflow-x-auto py-3">
      <div className="min-w-[620px] px-4">
        <div className="relative">
          {/* Continuous background track */}
          <div className="absolute top-5 left-5 right-5 h-1 bg-muted rounded-full -translate-y-1/2" />

          {/* Continuous active filled progress line */}
          <div
            className="absolute top-5 left-5 h-1 bg-primary rounded-full -translate-y-1/2 transition-all duration-500"
            style={{
              width: `calc((100% - 40px) * ${currentIndex <= 0 ? 0 : currentIndex / (ORDER_TIMELINE_STEPS.length - 1)})`,
            }}
          />

          {/* Step Nodes */}
          <div className="relative flex justify-between">
            {ORDER_TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={step} className="flex flex-col items-center w-10">
                  {/* Circle */}
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-2xs z-10',
                      isCompleted && 'border-primary bg-primary text-primary-foreground shadow-xs',
                      isCurrent &&
                        'border-primary bg-primary/10 text-primary ring-4 ring-primary/20 scale-105 font-bold',
                      !isCompleted && !isCurrent && 'border-muted-foreground/30 bg-muted text-muted-foreground',
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5 stroke-[2.5]" /> : renderStepIcon(step)}
                  </div>

                  {/* Step Label */}
                  <span
                    className={cn(
                      'mt-2.5 text-xs font-medium text-center leading-tight transition-colors whitespace-nowrap -mx-10',
                      isCurrent && 'text-primary font-bold',
                      isCompleted && 'text-foreground font-semibold',
                      !isCompleted && !isCurrent && 'text-muted-foreground',
                    )}
                  >
                    {t(`ORDERS.${step}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
