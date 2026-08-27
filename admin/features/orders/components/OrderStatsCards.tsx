'use client';

import { useTranslation } from 'react-i18next';
import { ShoppingBag, Clock, ChefHat, CheckCircle2, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { OrderFilterStatus, OrderStatsSummary } from '../types';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';
import { formatCurrency } from '@/utils';
import { cn } from '@/lib/utils';

interface OrderStatsCardsProps {
  stats: OrderStatsSummary;
  activeStatus: OrderFilterStatus;
  onSelectStatus: (status: OrderFilterStatus) => void;
}

export const OrderStatsCards = ({
  stats,
  activeStatus,
  onSelectStatus,
}: OrderStatsCardsProps) => {
  const { t } = useTranslation();

  const cards = [
    {
      id: 'ALL' as OrderFilterStatus,
      label: t('ORDERS.STAT_TOTAL'),
      value: stats.total,
      icon: ShoppingBag,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      id: OrderStatus.PENDING as OrderFilterStatus,
      label: t('ORDERS.STAT_PENDING'),
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      id: OrderStatus.CONFIRMED as OrderFilterStatus,
      label: t('ORDERS.STAT_PROCESSING'),
      value: stats.processing,
      icon: ChefHat,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      id: OrderStatus.DELIVERED as OrderFilterStatus,
      label: t('ORDERS.STAT_COMPLETED'),
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      id: 'REVENUE' as const,
      label: t('ORDERS.STAT_REVENUE'),
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      isRevenue: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = !card.isRevenue && activeStatus === card.id;

        return (
          <Card
            key={card.label}
            onClick={() => {
              if (!card.isRevenue) {
                onSelectStatus(card.id as OrderFilterStatus);
              }
            }}
            className={cn(
              'border transition-all duration-200 shadow-2xs',
              !card.isRevenue && 'cursor-pointer hover:border-primary/50 hover:shadow-md',
              isSelected && 'ring-2 ring-primary/60 border-primary shadow-sm bg-primary/5',
            )}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold tracking-tight mt-1">{card.value}</p>
              </div>
              <div className={cn('p-2.5 rounded-xl', card.bgColor)}>
                <Icon className={cn('h-5 w-5', card.color)} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
