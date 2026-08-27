'use client';

import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, ChefHat, Truck, PackageCheck, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';
import { getStatusConfig } from '../utils/order.utils';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
  className?: string;
}

const renderStatusIcon = (iconName: string) => {
  const iconProps = { className: 'h-3.5 w-3.5 mr-1.5 shrink-0' };
  switch (iconName) {
    case 'clock':
      return <Clock {...iconProps} />;
    case 'check-circle':
      return <CheckCircle2 {...iconProps} />;
    case 'chef-hat':
      return <ChefHat {...iconProps} />;
    case 'truck':
      return <Truck {...iconProps} />;
    case 'package-check':
      return <PackageCheck {...iconProps} />;
    case 'x-circle':
      return <XCircle {...iconProps} />;
    default:
      return null;
  }
};

export const OrderStatusBadge = ({
  status,
  showIcon = true,
  className,
}: OrderStatusBadgeProps) => {
  const { t } = useTranslation();
  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.badgeVariant}
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border shadow-2xs',
        config.badgeClassName,
        className,
      )}
    >
      {showIcon && renderStatusIcon(config.iconName)}
      <span>{t(config.label)}</span>
    </Badge>
  );
};
