'use client';

import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, ChefHat, Truck, Check, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderProgressStepperProps = {
  status: string;
};

export const OrderProgressStepper = ({ status }: OrderProgressStepperProps) => {
  const { t } = useTranslation();

  const isCancelled = status === 'CANCELLED';

  const steps = [
    {
      key: 'PENDING',
      label: t('ORDER.STATUS_PENDING'),
      icon: Clock,
    },
    {
      key: 'CONFIRMED',
      label: t('ORDER.STATUS_CONFIRMED'),
      icon: CheckCircle2,
    },
    {
      key: 'PREPARING',
      label: t('ORDER.STATUS_PREPARING'),
      icon: ChefHat,
    },
    {
      key: 'READY_FOR_SHIPMENT',
      label: t('ORDER.STATUS_SHIPPING'),
      icon: Truck,
    },
    {
      key: 'DELIVERED',
      label: t('ORDER.STATUS_DELIVERED'),
      icon: Check,
    },
  ];

  if (isCancelled) {
    return (
      <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/40 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-red-700 dark:text-red-400">
            {t('ORDER.CANCELLED_TITLE')}
          </h4>
          <p className="text-[11px] text-red-600/80 dark:text-red-400/80">
            {t('ORDER.CANCELLED_DESC')}
          </p>
        </div>
      </div>
    );
  }

  const statusOrder: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    PREPARING: 2,
    READY_FOR_SHIPMENT: 3,
    DELIVERED: 4,
  };

  const currentStepIndex = statusOrder[status] ?? 0;

  return (
    <div className="w-full py-2">
      <div className="relative">
        {/* Continuous background line connecting from center of first icon to center of last icon */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 dark:bg-zinc-800 -translate-y-1/2 rounded-full" />

        {/* Continuous active green progress line */}
        <div
          className="absolute top-4 left-4 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-500"
          style={{
            width: `calc((100% - 32px) * ${currentStepIndex / (steps.length - 1)})`,
          }}
        />

        {/* Step Nodes */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isPassed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center w-8">
                {/* Circle Icon */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 shrink-0',
                    isPassed && 'bg-emerald-500 text-white shadow-xs',
                    isCurrent &&
                      'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-950 shadow-md scale-110',
                    !isPassed &&
                      !isCurrent &&
                      'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 border-2 border-gray-200 dark:border-zinc-700',
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    'mt-2 text-[10px] sm:text-xs font-bold text-center transition-colors leading-tight whitespace-nowrap -mx-8',
                    isCurrent && 'text-orange-600 dark:text-orange-400',
                    isPassed && 'text-gray-900 dark:text-zinc-200',
                    !isPassed && !isCurrent && 'text-gray-400 dark:text-zinc-600',
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
