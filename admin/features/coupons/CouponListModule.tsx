'use client';

import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ApiMain } from '@/services/apis/main/api.main';
import { COUPON_LIST } from '@/constants';
import { formatCurrency } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const couponSchema = z.object({
  code: z.string().min(1, 'Mã coupon không được trống'),
  name: z.string().min(1, 'Tên không được trống'),
  description: z.string().optional(),
  value: z.coerce.number().min(1000, 'Giá trị giảm ít nhất 1.000đ'),
  minOrderAmount: z.coerce.number().min(0),
  maxUser: z.coerce.number().min(1),
  startDate: z.string().min(1, 'Chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Chọn ngày kết thúc'),
});

type CouponFormData = z.infer<typeof couponSchema>;

export const CouponListModule = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [COUPON_LIST, { page }],
    queryFn: () => ApiMain.instance.coupon.getCoupons({ page, limit: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CouponFormData) => ApiMain.instance.coupon.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUPON_LIST] });
      setDialogOpen(false);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ApiMain.instance.coupon.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [COUPON_LIST] }),
  });

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: '', name: '', value: 0, minOrderAmount: 0, maxUser: 100, startDate: '', endDate: '' },
  });

  const coupons = data?.kind === 'OK' ? data.data : [];
  const pagination = data?.kind === 'OK' ? data.pagination : undefined;

  const onSubmit = (formData: CouponFormData) => {
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('COUPONS.TITLE')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{pagination?.totalItems ?? 0} mã giảm giá</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={
              <Button onClick={() => form.reset()}>
                <Plus className="mr-2 h-4 w-4" /> {t('COUPONS.CREATE')}
              </Button>
            }
          />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('COUPONS.CREATE')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('COUPONS.CODE')}</Label>
                  <Input {...form.register('code')} placeholder="FASTFOOD20" />
                  {form.formState.errors.code && <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t('COUPONS.NAME')}</Label>
                  <Input {...form.register('name')} />
                  {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('COUPONS.VALUE')} (₫)</Label>
                  <Input type="number" {...form.register('value')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('COUPONS.MIN_ORDER')} (₫)</Label>
                  <Input type="number" {...form.register('minOrderAmount')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('COUPONS.START_DATE')}</Label>
                  <Input type="date" {...form.register('startDate')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('COUPONS.END_DATE')}</Label>
                  <Input type="date" {...form.register('endDate')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('COUPONS.MAX_USER')}</Label>
                <Input type="number" {...form.register('maxUser')} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>{t('COMMON.CANCEL')}</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('COMMON.SAVE')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('COUPONS.CODE')}</TableHead>
                <TableHead>{t('COUPONS.NAME')}</TableHead>
                <TableHead className="text-right">{t('COUPONS.VALUE')}</TableHead>
                <TableHead className="text-right">{t('COUPONS.MIN_ORDER')}</TableHead>
                <TableHead className="text-center">{t('COUPONS.USED_COUNT')}</TableHead>
                <TableHead className="text-center">{t('COMMON.STATUS')}</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>{Array.from({ length: 7 }).map((_, j) => (<TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>))}</TableRow>
                ))
              ) : coupons.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">{t('COMMON.NO_DATA')}</TableCell></TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.name}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(coupon.value)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(coupon.minOrderAmount)}</TableCell>
                    <TableCell className="text-center">{coupon.usedCount}/{coupon.maxUser}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                        {coupon.isActive ? t('COMMON.ACTIVE') : t('COMMON.INACTIVE')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> {t('COMMON.EDIT')}</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(coupon.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> {t('COMMON.DELETE')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
