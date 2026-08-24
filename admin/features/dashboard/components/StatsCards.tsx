'use client';

import { useTranslation } from 'react-i18next';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statsData = [
  {
    titleKey: 'DASHBOARD.TOTAL_ORDERS',
    value: '1,284',
    change: '+12.5%',
    icon: ShoppingCart,
    trend: 'up' as const,
  },
  {
    titleKey: 'DASHBOARD.TOTAL_REVENUE',
    value: '45.2M ₫',
    change: '+8.2%',
    icon: DollarSign,
    trend: 'up' as const,
  },
  {
    titleKey: 'DASHBOARD.TOTAL_PRODUCTS',
    value: '64',
    change: '+3',
    icon: Package,
    trend: 'up' as const,
  },
  {
    titleKey: 'DASHBOARD.TOTAL_USERS',
    value: '2,847',
    change: '+5.1%',
    icon: Users,
    trend: 'up' as const,
  },
];

export const StatsCards = () => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card
          key={stat.titleKey}
          className="relative overflow-hidden border-border/50 transition-shadow hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t(stat.titleKey)}
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <div className="mt-1 flex items-center gap-1">
              <Badge variant="secondary" className="gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 border-0">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </Badge>
              <span className="text-xs text-muted-foreground">so với tháng trước</span>
            </div>
          </CardContent>
          {/* Decorative gradient */}
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5" />
        </Card>
      ))}
    </div>
  );
};
