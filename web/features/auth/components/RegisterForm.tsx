'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, Phone, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRegister } from '../hooks/useRegister';
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const RegisterForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    form: {
      register,
      watch,
      formState: { errors },
    },
    currentStep,
    setCurrentStep,
    handleNextStep1,
    handleNextStep2,
    onSubmit,
    isLoading,
    errorMessage,
    isSuccess,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useRegister();

  const watchValues = watch();

  if (isSuccess) {
    return (
      <Card variant="default" className="text-center p-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 dark:border-green-800">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <CardTitle className="text-2xl font-extrabold mb-2">
          {t('AUTH.REGISTER_SUCCESS_TITLE', 'Đăng ký thành công!')}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm mb-6 leading-relaxed">
          {t('AUTH.REGISTER_SUCCESS_DESC', {
            name: watchValues.name || '',
            defaultValue: `Chào mừng ${watchValues.name} đã gia nhập thế giới KeiPizza. Tài khoản của bạn đã sẵn sàng để đặt món và nhận ngàn ưu đãi.`,
          })}
        </CardDescription>
        <Button type="button" onClick={() => router.push('/')} className="w-full">
          {t('AUTH.EXPLORE_MENU', 'Khám phá thực đơn ngay')}
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="default" className="p-0 overflow-hidden">
      {/* Step Tabs Header */}
      <div className="grid grid-cols-3 border-b border-border bg-gray-50/50 dark:bg-zinc-950/50">
        {/* Step 1 Tab */}
        <div
          className={`py-3.5 px-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors relative ${
            currentStep === 1
              ? 'text-[#ff6900] bg-white dark:bg-zinc-900'
              : currentStep > 1
                ? 'text-gray-700 dark:text-zinc-300 bg-white/60 dark:bg-zinc-900/60'
                : 'text-gray-400 dark:text-zinc-500'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 1
                ? 'bg-[#ff6900] text-white'
                : currentStep > 1
                  ? 'bg-green-600 text-white'
                  : 'border border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-zinc-500'
            }`}
          >
            {currentStep > 1 ? '✓' : '1'}
          </div>
          <span>{t('AUTH.STEP_1', 'Bước 1')}</span>
          {currentStep === 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ff6900] rounded-t-full" />
          )}
        </div>

        {/* Step 2 Tab */}
        <div
          className={`py-3.5 px-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors relative ${
            currentStep === 2
              ? 'text-[#ff6900] bg-white dark:bg-zinc-900'
              : currentStep > 2
                ? 'text-gray-700 dark:text-zinc-300 bg-white/60 dark:bg-zinc-900/60'
                : 'text-gray-400 dark:text-zinc-500'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 2
                ? 'bg-[#ff6900] text-white'
                : currentStep > 2
                  ? 'bg-green-600 text-white'
                  : 'border border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-zinc-500'
            }`}
          >
            {currentStep > 2 ? '✓' : '2'}
          </div>
          <span>{t('AUTH.STEP_2', 'Bước 2')}</span>
          {currentStep === 2 && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ff6900] rounded-t-full" />
          )}
        </div>

        {/* Step 3 Tab */}
        <div
          className={`py-3.5 px-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors relative ${
            currentStep === 3 ? 'text-[#ff6900] bg-white dark:bg-zinc-900' : 'text-gray-400 dark:text-zinc-500'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 3
                ? 'bg-[#ff6900] text-white'
                : 'border border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-zinc-500'
            }`}
          >
            3
          </div>
          <span>{t('AUTH.STEP_3', 'Bước 3')}</span>
          {currentStep === 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ff6900] rounded-t-full" />
          )}
        </div>
      </div>

      {/* Form Content Body */}
      <CardContent className="p-6 sm:p-8">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-medium leading-relaxed animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          {/* BƯỚC 1: Số điện thoại & Email */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Phone Field */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                  {t('AUTH.PHONE', 'Số điện thoại')} <span className="text-[#ff6900]">*</span>
                </label>
                <div className="flex items-center rounded-sm border border-border overflow-hidden focus-within:border-brand-muted hover:border-primary transition-all bg-transparent">
                  <span className="px-3.5 py-3 bg-gray-100/70 dark:bg-zinc-800 border-r border-border text-xs font-bold text-gray-600 dark:text-zinc-300 select-none">
                    +84
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder={t('AUTH.PHONE_PLACEHOLDER', 'Nhập số điện thoại của bạn')}
                    className="border-0 hover:border-0 focus:border-0 rounded-none h-11"
                  />
                </div>
                {errors.phone && <p className="text-[11px] font-medium text-red-500">{errors.phone.message}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                  {t('AUTH.EMAIL', 'Email')} <span className="text-[#ff6900]">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder={t('AUTH.EMAIL_PLACEHOLDER', 'Nhập email của bạn')}
                    aria-invalid={!!errors.email}
                    className="h-11"
                  />
                </div>
                {errors.email && <p className="text-[11px] font-medium text-red-500">{errors.email.message}</p>}
              </div>

              {/* Action Button Step 1 */}
              <div className="pt-3">
                <Button type="button" onClick={handleNextStep1} className="w-full">
                  {t('AUTH.CONFIRM_AND_CONTINUE', 'Xác nhận & Tiếp tục')}
                </Button>
              </div>
            </div>
          )}

          {/* BƯỚC 2: Thông tin cá nhân & Mật khẩu */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                  {t('AUTH.FULL_NAME', 'Họ và tên')} <span className="text-[#ff6900]">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder={t('AUTH.FULL_NAME_PLACEHOLDER', 'Nhập họ và tên của bạn')}
                  aria-invalid={!!errors.name}
                  className="h-11"
                />
                {errors.name && <p className="text-[11px] font-medium text-red-500">{errors.name.message}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                  {t('AUTH.PASSWORD', 'Mật khẩu')} <span className="text-[#ff6900]">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder={t('AUTH.PASSWORD_REQUIREMENT', 'Tối thiểu 8 ký tự, có số và chữ hoa')}
                    aria-invalid={!!errors.password}
                    className="h-11 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors focus:outline-none"
                    aria-label={
                      showPassword ? t('AUTH.HIDE_PASSWORD', 'Ẩn mật khẩu') : t('AUTH.SHOW_PASSWORD', 'Hiện mật khẩu')
                    }
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-[11px] font-medium text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
                  {t('AUTH.CONFIRM_PASSWORD', 'Xác nhận mật khẩu')} <span className="text-[#ff6900]">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder={t('AUTH.CONFIRM_PASSWORD_PLACEHOLDER', 'Nhập lại mật khẩu')}
                    aria-invalid={!!errors.confirmPassword}
                    className="h-11 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors focus:outline-none"
                    aria-label={
                      showConfirmPassword
                        ? t('AUTH.HIDE_PASSWORD', 'Ẩn mật khẩu')
                        : t('AUTH.SHOW_PASSWORD', 'Hiện mật khẩu')
                    }
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] font-medium text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Action Buttons Step 2 */}
              <div className="flex items-center gap-3 pt-3">
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(1)} className="w-1/3">
                  {t('COMMON.BACK', 'Quay lại')}
                </Button>
                <Button type="button" onClick={handleNextStep2} className="flex-1">
                  {t('COMMON.CONTINUE', 'Tiếp tục')}
                </Button>
              </div>
            </div>
          )}

          {/* BƯỚC 3: Xác nhận & Tạo tài khoản */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Summary Box */}
              <div className="bg-gray-50/80 dark:bg-zinc-950/80 rounded-xl p-4 border border-gray-200/60 dark:border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {t('AUTH.CONFIRM_REGISTER_INFO', 'Xác nhận thông tin đăng ký')}
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-zinc-300">
                  <User className="w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0" />
                  <span className="font-semibold">{watchValues.name || t('AUTH.NOT_ENTERED', 'Chưa nhập')}</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-zinc-300">
                  <Phone className="w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0" />
                  <span className="font-semibold">{watchValues.phone || t('AUTH.NOT_ENTERED', 'Chưa nhập')}</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-zinc-300">
                  <Mail className="w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0" />
                  <span className="font-semibold">{watchValues.email || t('AUTH.NOT_ENTERED', 'Chưa nhập')}</span>
                </div>
              </div>

              {/* Terms Agreement Checkbox */}
              <div className="space-y-1.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('agreeTerms')}
                    className="mt-0.5 w-4 h-4 text-primary rounded border-gray-300 dark:border-zinc-700 focus:ring-orange-500"
                  />
                  <span className="text-xs text-gray-600 dark:text-zinc-400 leading-snug">
                    {t('AUTH.AGREE_TERMS_PREFIX', 'Tôi đồng ý với')}{' '}
                    <Link href="#" className="font-semibold text-primary hover:underline">
                      {t('AUTH.TERMS_OF_SERVICE', 'Điều khoản dịch vụ')}
                    </Link>{' '}
                    {t('AUTH.AND', 'và')}{' '}
                    <Link href="#" className="font-semibold text-primary hover:underline">
                      {t('AUTH.PRIVACY_POLICY', 'Chính sách bảo mật')}
                    </Link>{' '}
                    {t('AUTH.OF_BRAND', 'của KeiPizza.')}
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-[11px] font-medium text-red-500">{errors.agreeTerms.message}</p>
                )}
              </div>

              {/* Action Buttons Step 3 */}
              <div className="flex items-center gap-3 pt-3">
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(2)} className="w-1/3">
                  {t('COMMON.BACK', 'Quay lại')}
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('AUTH.PROCESSING', 'Đang xử lý...')}</span>
                    </>
                  ) : (
                    <span>{t('AUTH.COMPLETE_REGISTRATION', 'Hoàn tất đăng ký')}</span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Bottom Sign In Link */}
        <div className="mt-6 text-center text-xs text-gray-600 dark:text-zinc-400 font-medium border-t border-border pt-4">
          {t('AUTH.HAVE_ACCOUNT', 'Đã có tài khoản?')}{' '}
          <Link href="/login" className="font-bold text-primary hover:text-brand-primary-active hover:underline ml-1">
            {t('AUTH.LOGIN_BUTTON', 'Đăng nhập')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
