'use client';

import { useTranslation } from 'react-i18next';
import { User, Phone, MapPin, MessageSquare, Mail, Calendar, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderResponseDto } from '../types';
import {
  getCustomerDisplayName,
  getCustomerPhone,
  getCustomerEmail,
  getDeliveryAddressText,
  formatOrderDateTime,
} from '../utils/order.utils';

interface OrderCustomerInfoProps {
  order: OrderResponseDto;
}

export const OrderCustomerInfo = ({ order }: OrderCustomerInfoProps) => {
  const { t } = useTranslation();
  const customerName = getCustomerDisplayName(order);
  const customerPhone = getCustomerPhone(order);
  const customerEmail = getCustomerEmail(order);
  const addressText = getDeliveryAddressText(order);
  const isRegisteredUser = Boolean(order.userId || order.user);

  return (
    <Card className="border-border/60 shadow-2xs">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            {t('ORDERS.CUSTOMER_INFO')}
          </span>
          {isRegisteredUser ? (
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              <UserCheck className="h-3 w-3 mr-1" />
              {t('ORDERS.REGISTERED_USER')}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              {t('ORDERS.UNREGISTERED_USER')}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3.5 text-sm">
        <div className="flex items-start gap-3">
          <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{t('ORDERS.CUSTOMER')}</p>
            <p className="font-medium text-foreground truncate">{customerName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{t('ORDERS.PHONE')}</p>
            {customerPhone !== '—' ? (
              <a
                href={`tel:${customerPhone}`}
                className="font-medium text-primary hover:underline"
              >
                {customerPhone}
              </a>
            ) : (
              <p className="text-muted-foreground">{customerPhone}</p>
            )}
          </div>
        </div>

        {customerEmail !== '—' && (
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium text-foreground truncate">{customerEmail}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{t('ORDERS.ADDRESS')}</p>
            <p className="font-medium text-foreground text-xs leading-relaxed">{addressText}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{t('COMMON.CREATED_AT')}</p>
            <p className="font-medium text-foreground text-xs">{formatOrderDateTime(order.createdAt)}</p>
          </div>
        </div>

        {order.notes && (
          <div className="pt-2 border-t mt-2">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {t('ORDERS.NOTES')}
                </p>
                <p className="text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg mt-1 whitespace-pre-line">
                  {order.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
