'use client';

import { useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Plus, Trash2, Home, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddressForm } from './AddressForm';
import { useMyAddresses } from '@/services/react-query/queries/address';
import { useCreateAddress, useDeleteAddress, useUpdateAddress } from '@/services/react-query/mutations/address';
import { useStore } from '@/stores';
import { AddressFormValues } from '../types';

type DeliveryAddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DeliveryAddressModal = ({ isOpen, onClose }: DeliveryAddressModalProps) => {
  const { t } = useTranslation();
  const accessToken = useStore((s) => s.accessToken);
  const isLoggedIn = !!accessToken;
  const currentDeliveryAddress = useStore((s) => s.deliveryAddress);
  const setDeliveryAddress = useStore((s) => s.setDeliveryAddress);

  const [activeTab, setActiveTab] = useState<'saved' | 'new'>('saved');

  // Queries & Mutations
  const { data: savedAddresses = [] } = useMyAddresses();
  const createAddressMutation = useCreateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const updateAddressMutation = useUpdateAddress();

  const handleSelectAddress = (fullAddress: string) => {
    setDeliveryAddress(fullAddress);
    onClose();
  };

  const handleCreateAddressSubmit = async (values: AddressFormValues) => {
    const fullAddress = [values.street, values.ward, values.district, values.city].filter(Boolean).join(', ');

    if (isLoggedIn) {
      try {
        await createAddressMutation.mutateAsync({
          street: values.street.trim(),
          city: values.city.trim(),
          district: values.district.trim(),
          ward: values.ward?.trim() || undefined,
          isDefault: values.isDefault ? 1 : 0,
        });
      } catch (error) {
        console.error('Failed to save address to account:', error);
      }
    }

    setDeliveryAddress(fullAddress);
    onClose();
  };

  const handleDeleteAddress = async (id: string, e: MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteAddressMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleSetDefault = async (addr: (typeof savedAddresses)[0], e: MouseEvent) => {
    e.stopPropagation();
    try {
      await updateAddressMutation.mutateAsync({
        id: addr.id,
        data: {
          street: addr.street,
          city: addr.city,
          district: addr.district,
          ward: addr.ward,
          isDefault: 1,
        },
      });
    } catch (error) {
      console.error('Failed to set address as default:', error);
    }
  };

  const hasSavedAddresses = isLoggedIn && savedAddresses.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg w-[95vw] p-0 overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xl focus:outline-none"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                {t('ADDRESS.MODAL_TITLE', { defaultValue: 'Địa chỉ nhận hàng' })}
              </DialogTitle>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                {t('ADDRESS.MODAL_SUBTITLE', { defaultValue: 'Chọn hoặc nhập địa chỉ để nhận pizza nhanh nhất' })}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label={t('COMMON.CLOSE', { defaultValue: 'Đóng' })}
            className="rounded-full size-8 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Tab Switcher (if logged in & has saved addresses) */}
          {hasSavedAddresses && (
            <div className="flex rounded-xl bg-gray-100 dark:bg-zinc-800 p-1 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'saved'
                    ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('ADDRESS.SAVED_TAB', { defaultValue: 'Địa chỉ đã lưu' })} ({savedAddresses.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'new'
                    ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {t('ADDRESS.NEW_TAB', { defaultValue: '+ Thêm địa chỉ mới' })}
              </button>
            </div>
          )}

          {/* TAB 1: Saved Addresses List */}
          {hasSavedAddresses && activeTab === 'saved' ? (
            <div className="space-y-3">
              {savedAddresses.map((addr) => {
                const fullText = [addr.street, addr.ward, addr.district, addr.city].filter(Boolean).join(', ');
                const isSelected = currentDeliveryAddress === fullText;

                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(fullText)}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#ff6900] bg-orange-50/40 dark:bg-orange-950/20 shadow-xs ring-1 ring-[#ff6900]/30'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60'
                    }`}
                  >
                    {/* Icon container / Selected check indicator */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-[#ff6900] text-white shadow-xs'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Home className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0 pr-14">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-black text-gray-900 dark:text-white truncate">{addr.street}</span>
                        {addr.isDefault === 1 ? (
                          <Badge className="bg-orange-100 dark:bg-orange-950/60 text-[#ff6900] text-[10px] font-bold px-2 py-0 border-0">
                            {t('ADDRESS.DEFAULT_BADGE', { defaultValue: 'Mặc định' })}
                          </Badge>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleSetDefault(addr, e)}
                            className="text-[10px] text-gray-400 hover:text-[#ff6900] font-medium opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                          >
                            {t('ADDRESS.SET_DEFAULT_ACTION', { defaultValue: 'Đặt mặc định' })}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {[addr.ward, addr.district, addr.city].filter(Boolean).join(', ')}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => handleDeleteAddress(addr.id, e)}
                        aria-label={t('COMMON.DELETE', { defaultValue: 'Xóa' })}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 size-7 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveTab('new')}
                  className="w-full gap-2 text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('ADDRESS.ADD_ANOTHER_ADDRESS', { defaultValue: 'Thêm địa chỉ giao hàng khác' })}</span>
                </Button>
              </div>
            </div>
          ) : (
            /* TAB 2: New Address Form */
            <div className="space-y-4">
              <AddressForm
                onSubmit={handleCreateAddressSubmit}
                isLoading={createAddressMutation.isPending}
                onCancel={hasSavedAddresses ? () => setActiveTab('saved') : undefined}
                showDefaultCheckbox={isLoggedIn}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
