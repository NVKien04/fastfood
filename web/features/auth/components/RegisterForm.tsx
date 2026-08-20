'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { useRegister } from '../hooks/useRegister';

export const RegisterForm: FC = () => {
  const router = useRouter();
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Đăng ký thành công!</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
          Chào mừng <strong>{watchValues.name}</strong> đã gia nhập thế giới Pizza Hut. Tài khoản của bạn đã sẵn sàng để đặt món và nhận ngàn ưu đãi.
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center justify-center cursor-pointer"
        >
          Khám phá thực đơn ngay
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      {/* Step Tabs Header */}
      <div className="grid grid-cols-3 border-b border-gray-100 bg-gray-50/50">
        {/* Step 1 Tab */}
        <div
          className={`py-3.5 px-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors relative ${
            currentStep === 1
              ? 'text-red-600 bg-white'
              : currentStep > 1
              ? 'text-gray-700 bg-white/60'
              : 'text-gray-400'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 1
                ? 'bg-red-600 text-white'
                : currentStep > 1
                ? 'bg-green-600 text-white'
                : 'border border-gray-300 text-gray-400'
            }`}
          >
            {currentStep > 1 ? '✓' : '1'}
          </div>
          <span>Bước 1</span>
          {currentStep === 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-red-600 rounded-t-full" />
          )}
        </div>

        {/* Step 2 Tab */}
        <div
          className={`py-3.5 px-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors relative ${
            currentStep === 2
              ? 'text-red-600 bg-white'
              : currentStep > 2
              ? 'text-gray-700 bg-white/60'
              : 'text-gray-400'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 2
                ? 'bg-red-600 text-white'
                : currentStep > 2
                ? 'bg-green-600 text-white'
                : 'border border-gray-300 text-gray-400'
            }`}
          >
            {currentStep > 2 ? '✓' : '2'}
          </div>
          <span>Bước 2</span>
          {currentStep === 2 && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-red-600 rounded-t-full" />
          )}
        </div>

        {/* Step 3 Tab */}
        <div
          className={`py-3.5 px-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors relative ${
            currentStep === 3 ? 'text-red-600 bg-white' : 'text-gray-400'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              currentStep === 3
                ? 'bg-red-600 text-white'
                : 'border border-gray-300 text-gray-400'
            }`}
          >
            3
          </div>
          <span>Bước 3</span>
          {currentStep === 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-red-600 rounded-t-full" />
          )}
        </div>
      </div>

      {/* Form Content Body */}
      <div className="p-6 sm:p-8">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50/80 border border-red-200/60 text-red-700 text-xs font-medium leading-relaxed animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          {/* BƯỚC 1: Số điện thoại & Email */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Phone Field */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-bold text-gray-700">
                  Số điện thoại <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all bg-white">
                  <span className="px-3.5 py-2.5 bg-gray-100/70 border-r border-gray-200 text-xs font-bold text-gray-600 select-none">
                    +84
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    placeholder="Nhập số điện thoại của bạn"
                    className="w-full h-11 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] font-medium text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-bold text-gray-700">
                  Email <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Nhập email của bạn"
                    className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-medium text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Action Button Step 1 */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="w-full h-11 sm:h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center justify-center cursor-pointer"
                >
                  Xác nhận & Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* BƯỚC 2: Thông tin cá nhân & Mật khẩu */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-xs font-bold text-gray-700">
                  Họ và tên <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="Nhập họ và tên của bạn"
                  className={`w-full h-11 px-3.5 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all ${
                    errors.name
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] font-medium text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700">
                  Mật khẩu <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Tối thiểu 8 ký tự, có số và chữ hoa"
                    className={`w-full h-11 pl-3.5 pr-10 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all ${
                      errors.password
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 focus:outline-none"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] font-medium text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700">
                  Xác nhận mật khẩu <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full h-11 pl-3.5 pr-10 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5 focus:outline-none"
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Action Buttons Step 2 */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 h-11 sm:h-12 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="flex-1 h-11 sm:h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-bold rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center justify-center cursor-pointer"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {/* BƯỚC 3: Xác nhận & Tạo tài khoản */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Summary Box */}
              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60 space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Xác nhận thông tin đăng ký
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-semibold">{watchValues.name || 'Chưa nhập'}</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-semibold">{watchValues.phone || 'Chưa nhập'}</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-semibold">{watchValues.email || 'Chưa nhập'}</span>
                </div>
              </div>

              {/* Terms Agreement Checkbox */}
              <div className="space-y-1.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('agreeTerms')}
                    className="mt-0.5 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-xs text-gray-600 leading-snug">
                    Tôi đồng ý với{' '}
                    <Link href="#" className="font-semibold text-red-600 hover:underline">
                      Điều khoản dịch vụ
                    </Link>{' '}
                    và{' '}
                    <Link href="#" className="font-semibold text-red-600 hover:underline">
                      Chính sách bảo mật
                    </Link>{' '}
                    của Pizza Hut.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-[11px] font-medium text-red-500">
                    {errors.agreeTerms.message}
                  </p>
                )}
              </div>

              {/* Action Buttons Step 3 */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-1/3 h-11 sm:h-12 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 sm:h-12 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Hoàn tất đăng ký</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Bottom Sign In Link */}
        <div className="mt-6 text-center text-xs text-gray-600 font-medium border-t border-gray-100 pt-4">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-bold text-red-600 hover:text-red-700 hover:underline ml-1">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
