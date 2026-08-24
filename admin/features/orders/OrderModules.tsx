'use client';

import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, use } from 'react';
import { Eye } from 'lucide-react';
import { ApiMain } from '@/services/apis/main/api.main';
import { ORDER_LIST, ORDER_DETAIL } from '@/constants';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';

const statusVariantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  PREPARING: 'outline',
  READY_FOR_SHIPMENT: 'outline',
  DELIVERED: 'default',
  CANCELLED: 'destructive',
};

export const OrderListModule = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: [ORDER_LIST, { page, status: statusFilter }],
    queryFn: () =>
      ApiMain.instance.order.getOrders({
        page,
        limit: 10,
        ...(statusFilter !== 'ALL' ? { status: statusFilter as OrderStatus } : {}),
      }),
  });

  const orders = data?.kind === 'OK' ? data.data : [];
  const pagination = data?.kind === 'OK' ? data.pagination : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('ORDERS.TITLE')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{pagination?.totalItems ?? 0} đơn hàng</p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={(val) => { if (val) setStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lọc trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {Object.values(OrderStatus).map((s) => (
                  <SelectItem key={s} value={s}>{t(`ORDERS.${s}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    {t('COMMON.NO_DATA')}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/orders/${order.id}`)}>
                    <TableCell className="font-medium font-mono">{order.orderNumber}</TableCell>
                    <TableCell>{order.guestName || order.user?.name || '—'}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[order.status] || 'secondary'}>
                        {t(`ORDERS.${order.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                {t('COMMON.PAGE')} {pagination.currentPage} {t('COMMON.OF')} {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>→</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const OrderDetailModule = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: [ORDER_DETAIL, id],
    queryFn: () => ApiMain.instance.order.getById(id),
    enabled: !!id,
  });

  const order = data?.kind === 'OK' ? data.data : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        {t('ORDERS.DETAIL')} #{order?.orderNumber || id}
      </h1>
      <Card className="border-border/50">
        <CardContent className="pt-6">
          {order ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div><span className="text-sm text-muted-foreground">{t('ORDERS.CUSTOMER')}</span><p className="font-medium">{order.guestName || order.user?.name || '—'}</p></div>
              <div><span className="text-sm text-muted-foreground">{t('ORDERS.TOTAL')}</span><p className="font-medium">{formatCurrency(order.total)}</p></div>
              <div><span className="text-sm text-muted-foreground">{t('ORDERS.STATUS')}</span><Badge variant={statusVariantMap[order.status] || 'secondary'}>{t(`ORDERS.${order.status}`)}</Badge></div>
              <div><span className="text-sm text-muted-foreground">{t('COMMON.CREATED_AT')}</span><p className="font-medium">{new Date(order.createdAt).toLocaleString('vi-VN')}</p></div>
            </div>
          ) : (
            <p className="text-muted-foreground">{t('COMMON.NO_DATA')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
