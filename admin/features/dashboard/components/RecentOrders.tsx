'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/utils';

const ORDER_STATUS_MAP: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  PENDING: { variant: 'secondary', label: 'ORDERS.PENDING' },
  CONFIRMED: { variant: 'default', label: 'ORDERS.CONFIRMED' },
  PREPARING: { variant: 'outline', label: 'ORDERS.PREPARING' },
  READY_FOR_SHIPMENT: { variant: 'outline', label: 'ORDERS.READY_FOR_SHIPMENT' },
  DELIVERED: { variant: 'default', label: 'ORDERS.DELIVERED' },
  CANCELLED: { variant: 'destructive', label: 'ORDERS.CANCELLED' },
};

const mockOrders = [
  { id: 'ORD-001', customer: 'Nguyễn Văn A', total: 235000, status: 'PENDING', createdAt: '2026-08-24T10:30:00Z' },
  { id: 'ORD-002', customer: 'Trần Thị B', total: 189000, status: 'CONFIRMED', createdAt: '2026-08-24T10:15:00Z' },
  { id: 'ORD-003', customer: 'Lê Văn C', total: 450000, status: 'PREPARING', createdAt: '2026-08-24T09:45:00Z' },
  { id: 'ORD-004', customer: 'Phạm Thị D', total: 120000, status: 'DELIVERED', createdAt: '2026-08-24T09:00:00Z' },
  { id: 'ORD-005', customer: 'Hoàng Văn E', total: 310000, status: 'CANCELLED', createdAt: '2026-08-23T18:30:00Z' },
];

export const RecentOrders = () => {
  const { t } = useTranslation();

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{t('DASHBOARD.RECENT_ORDERS')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('ORDERS.ORDER_NUMBER')}</TableHead>
              <TableHead>{t('ORDERS.CUSTOMER')}</TableHead>
              <TableHead className="text-right">{t('ORDERS.TOTAL')}</TableHead>
              <TableHead>{t('ORDERS.STATUS')}</TableHead>
              <TableHead className="text-right">{t('COMMON.CREATED_AT')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => {
              const statusConfig = ORDER_STATUS_MAP[order.status] || { variant: 'secondary' as const, label: order.status };
              return (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant} className="text-xs">
                      {t(statusConfig.label)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
