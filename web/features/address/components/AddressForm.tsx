'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { MapPin, Building, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addressSchema } from '../utils/address.schema';
import { AddressFormValues } from '../types';

type AddressFormProps = {
  initialValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
  showDefaultCheckbox?: boolean;
  submitButtonText?: string;
};

export const AddressForm = ({
  initialValues,
  onSubmit,
  isLoading = false,
  onCancel,
  showDefaultCheckbox = true,
  submitButtonText,
}: AddressFormProps) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: initialValues?.city || 'Hà Nội',
      district: initialValues?.district || '',
      ward: initialValues?.ward || '',
      street: initialValues?.street || '',
      isDefault: initialValues?.isDefault ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>
      {/* City Input */}
      <div className="space-y-1.5">
        <label htmlFor="city" className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>{t('ADDRESS.CITY_LABEL', { defaultValue: 'Tỉnh / Thành phố' })}</span>
            <span className="text-[#ff6900]">*</span>
          </span>
        </label>
        <Input
          id="city"
          type="text"
          {...register('city')}
          placeholder={t('ADDRESS.CITY_PLACEHOLDER', { defaultValue: 'Nhập Tỉnh / Thành phố (VD: Hà Nội, TP. Hồ Chí Minh...)' })}
          aria-invalid={!!errors.city}
        />
        {errors.city && <p className="text-[11px] font-medium text-red-500">{errors.city.message}</p>}
      </div>

      {/* District and Ward in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* District */}
        <div className="space-y-1.5">
          <label htmlFor="district" className="text-xs font-bold text-gray-700 dark:text-zinc-300 block">
            {t('ADDRESS.DISTRICT_LABEL', { defaultValue: 'Quận / Huyện' })} <span className="text-[#ff6900]">*</span>
          </label>
          <Input
            id="district"
            type="text"
            {...register('district')}
            placeholder={t('ADDRESS.DISTRICT_PLACEHOLDER', { defaultValue: 'VD: Cầu Giấy, Hoàn Kiếm...' })}
            aria-invalid={!!errors.district}
          />
          {errors.district && <p className="text-[11px] font-medium text-red-500">{errors.district.message}</p>}
        </div>

        {/* Ward */}
        <div className="space-y-1.5">
          <label htmlFor="ward" className="text-xs font-bold text-gray-700 dark:text-zinc-300 block">
            {t('ADDRESS.WARD_LABEL', { defaultValue: 'Phường / Xã' })}
          </label>
          <Input
            id="ward"
            type="text"
            {...register('ward')}
            placeholder={t('ADDRESS.WARD_PLACEHOLDER', { defaultValue: 'VD: Dịch Vọng, Hàng Bài...' })}
          />
        </div>
      </div>

      {/* Street / Detailed Address */}
      <div className="space-y-1.5">
        <label htmlFor="street" className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>{t('ADDRESS.STREET_LABEL', { defaultValue: 'Số nhà, tên đường, ngõ ngách' })}</span>
          <span className="text-[#ff6900]">*</span>
        </label>
        <Input
          id="street"
          type="text"
          {...register('street')}
          placeholder={t('ADDRESS.STREET_PLACEHOLDER', {
            defaultValue: 'VD: Số 12 ngõ 34, phố Trần Thái Tông...',
          })}
          aria-invalid={!!errors.street}
        />
        {errors.street && <p className="text-[11px] font-medium text-red-500">{errors.street.message}</p>}
      </div>

      {/* Default Checkbox */}
      {showDefaultCheckbox && (
        <div className="pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-gray-700 dark:text-zinc-300 font-medium">
            <input
              type="checkbox"
              {...register('isDefault')}
              className="w-4 h-4 rounded text-[#ff6900] accent-[#ff6900] focus:ring-[#ff6900] border-gray-300 dark:border-zinc-700"
            />
            <span>{t('ADDRESS.SET_AS_DEFAULT', { defaultValue: 'Đặt làm địa chỉ giao hàng mặc định' })}</span>
          </label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="w-1/3">
            {t('COMMON.CANCEL', { defaultValue: 'Hủy' })}
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('COMMON.SAVING', { defaultValue: 'Đang lưu...' })}</span>
            </>
          ) : (
            <span>{submitButtonText || t('ADDRESS.CONFIRM_AND_DELIVER', { defaultValue: 'Giao đến địa chỉ này' })}</span>
          )}
        </Button>
      </div>
    </form>
  );
};
