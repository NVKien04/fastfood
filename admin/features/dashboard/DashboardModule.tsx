'use client';

import { useTranslation } from 'react-i18next';
import { StatsCards } from './components/StatsCards';
import { RecentOrders } from './components/RecentOrders';

export const DashboardModule = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('DASHBOARD.TITLE')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tổng quan hoạt động kinh doanh của hệ thống
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-1">
        <RecentOrders />
      </div>
    </div>
  );
};
