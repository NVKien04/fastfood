'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OrderResponseDto } from '../types';
import { cancelOrderSchema, CancelOrderFormValues } from '../utils/order.schema';

interface CancelOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponseDto | null;
  onConfirm: (id: string, reason?: string) => Promise<void> | void;
  isLoading?: boolean;
}

export const CancelOrderDialog = ({
  isOpen,
  onClose,
  order,
  onConfirm,
  isLoading = false,
}: CancelOrderDialogProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelOrderFormValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: {
      reason: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ reason: '' });
    }
  }, [isOpen, reset]);

  if (!order) return null;

  const onSubmit = async (values: CancelOrderFormValues) => {
    await onConfirm(order.id, values.reason);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>{t('ORDERS.CANCEL_ORDER')}</DialogTitle>
          </div>
          <DialogDescription>
            {t('ORDERS.CANCEL_CONFIRM')} (<strong>#{order.orderNumber}</strong>)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cancel-reason" className="text-sm font-medium">
              {t('ORDERS.CANCEL_REASON')} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder={t('ORDERS.CANCEL_REASON_PLACEHOLDER')}
              rows={3}
              {...register('reason')}
              className={errors.reason ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">
                {t(errors.reason.message || 'ORDERS.CANCEL_REASON_REQUIRED')}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('COMMON.CANCEL')}
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('ORDERS.CANCEL_ORDER')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
