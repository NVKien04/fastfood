'use client';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '../hooks/useLogin';

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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Đăng nhập</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Chào mừng bạn quay trở lại! Vui lòng nhập thông tin để tiếp tục.
        </p>
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50/80 border border-red-200/60 text-red-700 text-xs font-medium leading-relaxed animate-in fade-in zoom-in-95 duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Email / Phone Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-gray-700">
            Số điện thoại hoặc email
          </label>
          <div className="relative">
            <input
              id="email"
              type="text"
              {...register('email')}
              placeholder="Nhập số điện thoại hoặc email của bạn"
              className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all ${
                errors.email
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              }`}
            />
          </div>
          {errors.email && <p className="text-[11px] font-medium text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-bold text-gray-700">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="Vui lòng nhập mật khẩu của bạn"
              className={`w-full h-11 pl-3.5 pr-10 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all ${
                errors.password
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              }`}
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 focus:outline-none"
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
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 sm:h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
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

      {/* Bottom Sign Up Link */}
      <div className="mt-6 text-center text-xs text-gray-600 font-medium">
        Bạn chưa có tài khoản?{' '}
        <Link href="/register" className="font-bold text-red-600 hover:text-red-700 hover:underline ml-1">
          Tạo tài khoản
        </Link>
      </div>
    </div>
  );
};
