'use client';

import { useTranslation } from 'react-i18next';
import { Loader2, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OrderResponseDto } from '../types';
import { OrderStatus } from '@/services/apis/main/generated/data-contracts';
import { OrderStatusBadge } from './OrderStatusBadge';

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponseDto | null;
  targetStatus: OrderStatus | null;
  onConfirm: (id: string, status: OrderStatus) => Promise<void> | void;
  isLoading?: boolean;
}

export const UpdateStatusDialog = ({
  isOpen,
  onClose,
  order,
  targetStatus,
  onConfirm,
  isLoading = false,
}: UpdateStatusDialogProps) => {
  const { t } = useTranslation();

  if (!order || !targetStatus) return null;

  const handleConfirm = async () => {
    await onConfirm(order.id, targetStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('ORDERS.UPDATE_STATUS')}</DialogTitle>
          <DialogDescription>
            {t('ORDERS.UPDATE_STATUS_CONFIRM')} <strong>#{order.orderNumber}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 py-4 bg-muted/30 rounded-xl border">
          <OrderStatusBadge status={order.status} />
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <OrderStatusBadge status={targetStatus} />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('COMMON.CANCEL')}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('COMMON.CONFIRM')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
