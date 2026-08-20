'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateOrder } from '@/services/react-query/mutations/order';
import { useStore } from '@/stores';
import { DEFAULT_DELIVERY_FEE, PaymentMethodEnum } from '@/constants';
import { transformCartItemsToOrderPayload } from '@/helpers';
import { checkoutSchema } from '../utils/checkout.schema';
import { CheckoutFormValues, OrderResponseDto } from '../types';

export const useCheckout = () => {
  const user = useStore((s) => s.user);
  const items = useStore((s) => s.items);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeItem = useStore((s) => s.removeItem);
  const clearCart = useStore((s) => s.clearCart);
  const subTotal = useStore((s) => s.getTotalPrice());

  const deliveryFee = DEFAULT_DELIVERY_FEE;
  const total = subTotal + deliveryFee;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<OrderResponseDto | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      guestName: user?.fullName || '',
      guestPhone: '',
      guestAddress: '',
      notes: '',
      paymentMethod: PaymentMethodEnum.COD,
    },
  });

  // Autofill user profile info when user changes/loads
  useEffect(() => {
    if (user?.fullName) {
      form.setValue('guestName', user.fullName);
    }
  }, [user, form]);

  const createOrderMutation = useCreateOrder();

  const _handleFormSubmit = useCallback(
    async (values: CheckoutFormValues) => {
      if (items.length === 0) {
        setErrorMessage('Giỏ hàng của bạn đang trống!');
        return;
      }

      setErrorMessage(null);

      const payload = {
        items: transformCartItemsToOrderPayload(items),
        guestName: values.guestName.trim(),
        guestPhone: values.guestPhone.trim(),
        guestAddress: values.guestAddress.trim(),
        notes: values.notes?.trim() || '',
        paymentMethod: values.paymentMethod,
      };

      createOrderMutation.mutate(payload, {
        onSuccess: (data) => {
          if (data) {
            setCreatedOrder(data);
            clearCart();
          } else {
            setErrorMessage('Đặt hàng thất bại. Vui lòng thử lại sau.');
          }
        },
        onError: (err: Error) => {
          setErrorMessage(err.message || 'Đặt hàng thất bại. Vui lòng thử lại sau.');
        },
      });
    },
    [items, createOrderMutation, clearCart],
  );

  const _handleSubmit = form.handleSubmit(_handleFormSubmit);

  return {
    form,
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subTotal,
    deliveryFee,
    total,
    onSubmit: _handleSubmit,
    isLoading: createOrderMutation.isPending,
    errorMessage,
    createdOrder,
  };
};
