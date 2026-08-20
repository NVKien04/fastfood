'use client';

import { FC, BaseSyntheticEvent } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type ProfileFormProps = {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  userEmail?: string;
  isUpdating: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
};

export const ProfileForm: FC<ProfileFormProps> = ({
  form,
  onSubmit,
  userEmail,
  isUpdating,
  statusMessage,
}) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs font-semibold animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 block">Họ và tên</label>
        <div className="relative">
          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            {...register('name')}
            placeholder="Nhập họ và tên của bạn"
            className={`pl-10 h-12 rounded-2xl bg-gray-50/50 ${
              errors.name ? 'border-red-500' : 'border-gray-200'
            }`}
          />
        </div>
        {errors.name && (
          <p className="text-[11px] font-medium text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email (Read only) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 block">Địa chỉ Email</label>
        <div className="relative">
          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="email"
            value={userEmail || ''}
            disabled
            className="pl-10 h-12 rounded-2xl bg-gray-100/70 border-gray-200 text-gray-500 cursor-not-allowed"
          />
        </div>
        <p className="text-[10px] text-gray-400">Email tài khoản không thể thay đổi</p>
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 block">Số điện thoại</label>
        <div className="relative">
          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="tel"
            {...register('phone')}
            placeholder="Nhập số điện thoại của bạn"
            className={`pl-10 h-12 rounded-2xl bg-gray-50/50 ${
              errors.phone ? 'border-red-500' : 'border-gray-200'
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-[11px] font-medium text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isUpdating}
          className="w-full h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black rounded-2xl shadow-lg shadow-red-600/20 text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu thay đổi...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu thông tin</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
