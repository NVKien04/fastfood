'use client';

import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '../hooks/useLogin';
import { useGoogleCallback } from '../hooks/useGoogleCallback';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const LoginForm = () => {
  const { t } = useTranslation();
  const {
    form: {
      register,
      formState: { errors },
    },
    onSubmit,
    isLoading,
    errorMessage,
    showPassword,
    handleTogglePassword,
  } = useLogin();

  const { isProcessingGoogle, googleError, handleGoogleLogin } = useGoogleCallback();

  const displayError = errorMessage || googleError;

  return (
    <Card variant="default" className="w-full">
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl font-extrabold tracking-tight">
          {t('AUTH.LOGIN_TITLE', 'Đăng nhập')}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm mt-1">
          {t('AUTH.LOGIN_SUBTITLE', 'Chào mừng bạn quay trở lại! Vui lòng nhập thông tin để tiếp tục.')}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {/* Error Notification */}
        {displayError && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-medium leading-relaxed animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {/* Email / Phone Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
              {t('AUTH.EMAIL_OR_PHONE', 'Số điện thoại hoặc email')}
            </label>
            <div className="relative">
              <Input
                id="email"
                type="text"
                {...register('email')}
                placeholder={t('AUTH.EMAIL_OR_PHONE_PLACEHOLDER', 'Nhập số điện thoại hoặc email của bạn')}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && <p className="text-[11px] font-medium text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
              {t('AUTH.PASSWORD', 'Mật khẩu')}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder={t('AUTH.PASSWORD_PLACEHOLDER', 'Vui lòng nhập mật khẩu của bạn')}
                aria-invalid={!!errors.password}
                className="pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleTogglePassword}
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

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-0.5">
            <Link
              href="#"
              className="text-xs font-semibold text-primary hover:text-brand-primary-active hover:underline transition-colors"
            >
              {t('AUTH.FORGOT_PASSWORD', 'Quên mật khẩu?')}
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" disabled={isLoading || isProcessingGoogle} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('AUTH.LOGGING_IN', 'Đang đăng nhập...')}</span>
                </>
              ) : (
                <span>{t('AUTH.LOGIN_BUTTON', 'Đăng Nhập')}</span>
              )}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
          <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
            {t('AUTH.OR', 'Hoặc')}
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={handleGoogleLogin}
          disabled={isLoading || isProcessingGoogle}
          className="w-full gap-3 cursor-pointer"
        >
          {isProcessingGoogle ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-zinc-400" />
              <span>{t('AUTH.LOGGING_IN_GOOGLE', 'Đang xử lý đăng nhập Google...')}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t('AUTH.LOGIN_WITH_GOOGLE', 'Đăng nhập với Google')}</span>
            </>
          )}
        </Button>

        {/* Bottom Sign Up Link */}
        <div className="mt-6 text-center text-xs text-gray-600 dark:text-zinc-400 font-medium">
          {t('AUTH.NO_ACCOUNT', 'Bạn chưa có tài khoản?')}{' '}
          <Link
            href="/register"
            className="font-bold text-primary hover:text-brand-primary-active hover:underline ml-1"
          >
            {t('AUTH.CREATE_ACCOUNT', 'Tạo tài khoản')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
