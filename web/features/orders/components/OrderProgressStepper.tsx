'use client';

import { useTranslation } from 'react-i18next';
import { CheckCircle2, Clock, ChefHat, Truck, Check, XCircle } from 'lucide-react';

type StepStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY_FOR_SHIPMENT' | 'DELIVERED' | 'CANCELLED';

interface OrderProgressStepperProps {
  status: string;
}

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
      <div className="relative flex items-center justify-between">
        {/* Continuous background bar */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-zinc-800 -translate-y-1/2 z-0 rounded-full" />
        {/* Completed bar */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPassed
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : isCurrent
                      ? 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-950 shadow-md scale-110'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 border-2 border-gray-200 dark:border-zinc-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span
                className={`mt-1.5 text-[10px] sm:text-xs font-bold text-center transition-colors max-w-[65px] sm:max-w-[80px] leading-tight ${
                  isCurrent
                    ? 'text-orange-600 dark:text-orange-400'
                    : isPassed
                      ? 'text-gray-900 dark:text-zinc-200'
                      : 'text-gray-400 dark:text-zinc-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
