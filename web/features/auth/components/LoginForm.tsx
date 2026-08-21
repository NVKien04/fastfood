'use client';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '../hooks/useLogin';
import { useGoogleCallback } from '../hooks/useGoogleCallback';

export const LoginForm: FC = () => {
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
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40 p-6 sm:p-8 transition-colors">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Đăng nhập</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Chào mừng bạn quay trở lại! Vui lòng nhập thông tin để tiếp tục.
        </p>
      </div>

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
            Số điện thoại hoặc email
          </label>
          <div className="relative">
            <input
              id="email"
              type="text"
              {...register('email')}
              placeholder="Nhập số điện thoại hoặc email của bạn"
              className={`w-full h-11 px-3.5 rounded-xl border bg-white dark:bg-zinc-950 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none transition-all ${
                errors.email
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              }`}
            />
          </div>
          {errors.email && <p className="text-[11px] font-medium text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-zinc-300">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="Vui lòng nhập mật khẩu của bạn"
              className={`w-full h-11 pl-3.5 pr-10 rounded-xl border bg-white dark:bg-zinc-950 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:outline-none transition-all ${
                errors.password
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-gray-200 dark:border-zinc-800 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              }`}
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors p-0.5 focus:outline-none"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] font-medium text-red-500">{errors.password.message}</p>}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end pt-0.5">
          <Link
            href="#"
            className="text-xs font-semibold text-[#ff6900] hover:text-[#e05d00] hover:underline transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || isProcessingGoogle}
            className="w-full h-11 sm:h-12 bg-[#ff6900] hover:bg-[#e05d00] active:bg-[#cc5200] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('AUTH.LOGGING_IN', 'Đang đăng nhập...')}</span>
              </>
            ) : (
              <span>{t('AUTH.LOGIN_BUTTON', 'Đăng Nhập')}</span>
            )}
          </button>
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
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading || isProcessingGoogle}
        className="w-full h-11 sm:h-12 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-800 active:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
      >
        {isProcessingGoogle ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-zinc-400" />
            <span>Đang xử lý đăng nhập Google...</span>
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
      </button>

      {/* Bottom Sign Up Link */}
      <div className="mt-6 text-center text-xs text-gray-600 dark:text-zinc-400 font-medium">
        Bạn chưa có tài khoản?{' '}
        <Link href="/register" className="font-bold text-[#ff6900] hover:text-[#e05d00] hover:underline ml-1">
          Tạo tài khoản
        </Link>
      </div>
    </div>
  );
};
