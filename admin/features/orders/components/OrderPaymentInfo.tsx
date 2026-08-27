'use client';

import { useTranslation } from 'react-i18next';
import { CreditCard, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderResponseDto } from '../types';
import { formatCurrency } from '@/utils';
import { getPaymentMethodLabel, getPaymentStatusConfig } from '../utils/order.utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderPaymentInfoProps {
  order: OrderResponseDto;
}

export const OrderPaymentInfo = ({ order }: OrderPaymentInfoProps) => {
  const { t } = useTranslation();
  const paymentMethodLabel = getPaymentMethodLabel(order.paymentMethod);
  const paymentStatusConfig = getPaymentStatusConfig(order.paymentStatus);

  return (
    <Card className="border-border/60 shadow-2xs">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" />
          {t('ORDERS.PAYMENT')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t('ORDERS.SUBTOTAL')}</span>
          <span className="font-medium text-foreground">{formatCurrency(order.subTotal || 0)}</span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span>{t('ORDERS.SHIPPING_FEE')}</span>
          <span className="font-medium text-foreground">
            {order.deliveryFee > 0 ? formatCurrency(order.deliveryFee) : 'Miễn phí'}
          </span>
        </div>

        {order.discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span>{t('ORDERS.DISCOUNT')}</span>
            <span className="font-semibold">-{formatCurrency(order.discount)}</span>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between text-base font-bold">
          <span>{t('ORDERS.TOTAL')}</span>
          <span className="text-primary text-lg">{formatCurrency(order.total || 0)}</span>
        </div>

        <div className="pt-3 border-t space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" />
              {t('ORDERS.PAYMENT_METHOD')}
            </span>
            <span className="font-medium text-foreground text-right">{paymentMethodLabel}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('ORDERS.PAYMENT_STATUS')}</span>
            <Badge
              variant="outline"
              className={cn('text-[11px] font-medium border px-2 py-0.5', paymentStatusConfig.className)}
            >
              {paymentStatusConfig.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
