'use client';

import { BaseSyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
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

export const ProfileForm = ({ form, onSubmit, userEmail, isUpdating, statusMessage }: ProfileFormProps) => {
  const { t } = useTranslation();
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
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block">
          {t('PROFILE.FULL_NAME')}
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            {...register('name')}
            placeholder={t('PROFILE.NAME_PLACEHOLDER')}
            className={`pl-10 h-12 rounded-2xl bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 ${
              errors.name ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'
            }`}
          />
        </div>
        {errors.name && <p className="text-[11px] font-medium text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email (Read only) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block">
          {t('PROFILE.EMAIL')}
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="email"
            value={userEmail || ''}
            disabled
            className="pl-10 h-12 rounded-2xl bg-gray-100/70 dark:bg-zinc-800/80 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 cursor-not-allowed"
          />
        </div>
        <p className="text-[10px] text-gray-400 dark:text-zinc-500">
          {t('PROFILE.EMAIL_IMMUTABLE')}
        </p>
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block">
          {t('PROFILE.PHONE')}
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="tel"
            {...register('phone')}
            placeholder={t('PROFILE.PHONE_PLACEHOLDER')}
            className={`pl-10 h-12 rounded-2xl bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 ${
              errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'
            }`}
          />
        </div>
        {errors.phone && <p className="text-[11px] font-medium text-red-500">{errors.phone.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isUpdating}
          className="w-full h-12 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#cc5200] text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('PROFILE.SAVING')}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{t('PROFILE.SAVE_INFO')}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
