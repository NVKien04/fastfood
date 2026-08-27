'use client';

import { CreditCard, Banknote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PaymentMethod } from '@/services/apis/main/generated/data-contracts';
import { getPaymentMethodLabel, getPaymentStatusConfig } from '../utils/order.utils';
import { cn } from '@/lib/utils';

interface OrderPaymentBadgeProps {
  paymentMethod?: PaymentMethod | null;
  paymentStatus?: string;
  className?: string;
}

export const OrderPaymentBadge = ({
  paymentMethod,
  paymentStatus,
  className,
}: OrderPaymentBadgeProps) => {
  const methodLabel = getPaymentMethodLabel(paymentMethod);
  const statusConfig = getPaymentStatusConfig(paymentStatus);

  return (
    <div className={cn('flex flex-col gap-1 items-start', className)}>
      <Badge
        variant="outline"
        className={cn('text-xs font-medium border px-2 py-0.5 rounded-md', statusConfig.className)}
      >
        {statusConfig.label}
      </Badge>
      <div className="flex items-center text-xs text-muted-foreground">
        {paymentMethod === PaymentMethod.COD ? (
          <Banknote className="h-3 w-3 mr-1 text-muted-foreground" />
        ) : (
          <CreditCard className="h-3 w-3 mr-1 text-muted-foreground" />
        )}
        <span className="truncate max-w-[140px]">{methodLabel}</span>
      </div>
    </div>
  );
};
