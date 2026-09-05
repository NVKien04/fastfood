'use client';

import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  User as UserIcon,
  ChevronDown,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Sun,
  Moon,
  Laptop,
  Check,
  Palette,
  PackageSearch,
  Headphones,
  LogIn,
  UserPlus,
  Ticket,
} from 'lucide-react';
import { useStore } from '@/stores';
import { THEME } from '@/constants';
import { ApiMain } from '@/services/apis/main/api.main';
import { formatVND } from '@/utils';
import { NotificationBell } from '@/features/notification';
import { DeliveryAddressModal } from '@/features/address';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  className?: string;
  deliveryAddress?: string;
  onAddressClick?: () => void;
};

export const Header = ({ className = '', deliveryAddress: customDeliveryAddress, onAddressClick }: HeaderProps) => {
  // 1. Next.js Router & navigation hooks
  const router = useRouter();

  // 2. Translation hook
  const { t } = useTranslation();

  // 3. Local state & refs
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // 4. Zustand global state
  const user = useStore((s) => s.user);
  const accessToken = useStore((s) => s.accessToken);
  const cartTotalCount = useStore((s) => s.getTotalCount());
  const cartTotalPrice = useStore((s) => s.getTotalPrice());
  const theme = useStore((s) => s.theme);
  const updateTheme = useStore((s) => s.updateTheme);
  const storeDeliveryAddress = useStore((s) => s.deliveryAddress);

  const activeDeliveryAddress = customDeliveryAddress || storeDeliveryAddress;

  // 5. Memoized values
  const isLoggedIn = useMemo(() => !!accessToken, [accessToken]);

  const userDisplayName = useMemo(() => {
    if (!user) return '';
    return user.fullName || user.email || t('NAV.PROFILE');
  }, [user, t]);

  const currentThemeLabel = useMemo(() => {
    switch (theme) {
      case 'light':
        return t('THEME.LIGHT');
      case 'dark':
        return t('THEME.DARK');
      case 'system':
      default:
        return t('THEME.SYSTEM');
    }
  }, [theme, t]);

  // 6. Effects (handle click outside menus)
  useEffect(() => {
    const _handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
        setIsThemeSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', _handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', _handleClickOutside);
    };
  }, []);

  // 7. Event handlers
  const _handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    setIsThemeSubmenuOpen(false);
  }, []);

  const _handleNavigate = useCallback(
    (path: string) => {
      setIsMenuOpen(false);
      setIsThemeSubmenuOpen(false);
      router.push(path);
    },
    [router],
  );

  const _handleLogout = useCallback(async () => {
    setIsMenuOpen(false);
    setIsThemeSubmenuOpen(false);
    try {
      await ApiMain.instance.auth.logout();
    } catch {
      // ignore logout API error on client side cleanup
    } finally {
      useStore.getState().clearAuth();
      router.push('/login');
    }
  }, [router]);

  const _handleThemeChange = (newTheme: THEME) => {
    updateTheme(newTheme);
    setIsThemeSubmenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full h-27.5 min-h-27.5 max-h-27.5 bg-white dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-colors ${className}`}
    >
      <div className="max-w-7xl w-full h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* ========================================================= */}
        {/* Left Side: Brand Logo (1) and Delivery Address (2) */}
        {/* ========================================================= */}
        <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 min-w-0">
          {/* 1. Logo + Brand "KeiPizza" + Subtitle */}
          <Link href="/" className="flex items-center gap-3.5 group select-none shrink-0">
            {/* Logo Badge */}
            <div className="w-12 h-12 rounded-full bg-[#ff6900] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.45-1 1-1h14c.55 0 1 .45 1 1 0 4.41-3.59 8-8 8zm6.5-10H5.5c-.45-1.92 1.4-3.5 3.5-3.5h6c2.1 0 3.95 1.58 3.5 3.5z" />
              </svg>
            </div>

            {/* Brand Name & Description */}
            <div className="flex flex-col">
              <span className="text-2xl sm:text-[28px] font-black tracking-tight text-gray-900 dark:text-white leading-tight group-hover:text-[#ff6900] transition-colors">
                KeiPizza
              </span>
              <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">{t('NAV.STORES_COUNT')}</span>
            </div>
          </Link>

          {/* 2. Delivery Address Information */}
          <div
            onClick={() => {
              if (onAddressClick) {
                onAddressClick();
              } else {
                setIsAddressModalOpen(true);
              }
            }}
            className="hidden md:flex flex-col text-left cursor-pointer group hover:opacity-90 transition-opacity select-none min-w-0 max-w-65 lg:max-w-xs"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-gray-900 dark:text-white">
              <span className="shrink-0">{t('NAV.DELIVERY_TO')}</span>
              <span className="text-[#ff6900] group-hover:underline truncate">{activeDeliveryAddress}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 group-hover:text-[#ff6900] transition-colors shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
              <span className="font-bold text-gray-800 dark:text-zinc-300">{t('NAV.DELIVERY_TIME')}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-bold">4.8 ★</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Right Side: Notification, Language Dropdown, Cart, User Menu */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Notification Bell Dropdown Modal */}
          <NotificationBell />

          {/* ========================================================= */}
          {/* Language Selector */}
          {/* ========================================================= */}
          <LanguageSwitcher variant="compact" />

          {/* Orange Cart Pill Button with Badge on Top-Right Corner */}
          <Link
            href="/checkout"
            className="relative flex items-center gap-2 px-3.5 sm:px-4 h-9 rounded-full bg-[#ff6900] hover:bg-[#e05d00] active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer select-none shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-white shrink-0" />
            <span className="leading-none">
              {cartTotalPrice > 0
                ? formatVND(cartTotalPrice)
                : cartTotalCount > 0
                  ? t('CART.ITEMS_COUNT', { count: cartTotalCount, defaultValue: `${cartTotalCount} món` })
                  : t('NAV.CART')}
            </span>

            {/* Badge on Top-Right Corner of the Button */}
            {cartTotalCount > 0 && (
              <span className="absolute -top-1.5 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-900 leading-none">
                {cartTotalCount}
              </span>
            )}
          </Link>

          {/* ========================================================= */}
          {/* User / Navigation Menu Trigger Button */}
          {/* ========================================================= */}
          <div className="relative shrink-0" ref={menuRef}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={_handleToggleMenu}
              aria-expanded={isMenuOpen}
              aria-label={t('NAV.MENU', { defaultValue: 'Menu' })}
              className="flex items-center gap-2 px-3 h-9 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer select-none"
            >
              <Menu className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
              <div className="relative w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-300 overflow-hidden">
                {isLoggedIn && user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={userDisplayName}
                    fill
                    sizes="24px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400" />
                )}
              </div>
            </Button>

            {/* ========================================================= */}
            {/* User Dropdown Menu (Màu sắc tối giản Trắng Đen) */}
            {/* ========================================================= */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl shadow-black/10 dark:shadow-black/60 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none">
                <div className="space-y-0.5">
                  {/* 1. Trạng thái Auth: Tài khoản (auth=true) hoặc Đăng nhập/Đăng ký (auth=false) */}
                  {isLoggedIn ? (
                    /* Khi đã đăng nhập: Mục "Tài khoản" dạng list item đơn giản */
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => _handleNavigate('/profile')}
                      className="w-full h-9 flex items-center justify-start gap-3 px-3 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                      <span className="truncate">{userDisplayName}</span>
                    </Button>
                  ) : (
                    /* Khi chưa đăng nhập: Mục "Đăng nhập" & "Đăng ký" */
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => _handleNavigate('/login')}
                        className="w-full h-9 flex items-center justify-start gap-3 px-3 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                        <span>{t('NAV.LOGIN')}</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => _handleNavigate('/register')}
                        className="w-full h-9 flex items-center justify-start gap-3 px-3 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                        <span>{t('NAV.REGISTER')}</span>
                      </Button>
                    </>
                  )}

                  {/* 2. Đơn hàng của tôi / Theo dõi đơn hàng */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => _handleNavigate(isLoggedIn ? '/orders' : '/login')}
                    className="w-full h-9 flex items-center justify-start gap-3 px-3 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <PackageSearch className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                    <span>{t('NAV.TRACK_ORDER')}</span>
                  </Button>

                  {/* 3. Ví Voucher / Mã giảm giá */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => _handleNavigate(isLoggedIn ? '/vouchers' : '/login')}
                    className="w-full h-9 flex items-center justify-start gap-3 px-3 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-[#ff6900]" />
                    <span className="flex-1 text-left">{t('NAV.VOUCHERS')}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                      HOT
                    </span>
                  </Button>

                  {/* 4. Hỗ trợ khách hàng */}
                  <a
                    href="tel:19001822"
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                    <span>{t('NAV.CUSTOMER_SUPPORT')}</span>
                  </a>

                  {/* 4. Giao diện (Menu Cấp 2) */}
                  <div className="pt-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsThemeSubmenuOpen((prev) => !prev)}
                      className={`w-full h-9 flex items-center justify-between px-3 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                        isThemeSubmenuOpen
                          ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Palette className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                        <span>{t('THEME.TITLE')}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-zinc-400">
                        <span>{currentThemeLabel}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isThemeSubmenuOpen ? 'rotate-90 text-gray-900 dark:text-white' : ''
                          }`}
                        />
                      </span>
                    </Button>

                    {/* Submenu cấp 2 mở rộng bên dưới */}
                    {isThemeSubmenuOpen && (
                      <div className="mt-1 ml-2 pl-2 border-l border-gray-250 dark:border-zinc-800 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Sáng */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => _handleThemeChange('light')}
                          className={`w-full h-9 flex items-center justify-between px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            theme === 'light'
                              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Sun className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                            <span>{t('THEME.LIGHT')}</span>
                          </span>
                          {theme === 'light' && (
                            <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white stroke-[2.5]" />
                          )}
                        </Button>

                        {/* Tối */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => _handleThemeChange('dark')}
                          className={`w-full h-9 flex items-center justify-between px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            theme === 'dark'
                              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Moon className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                            <span>{t('THEME.DARK')}</span>
                          </span>
                          {theme === 'dark' && (
                            <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white stroke-[2.5]" />
                          )}
                        </Button>

                        {/* Hệ thống */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => _handleThemeChange('system')}
                          className={`w-full h-9 flex items-center justify-between px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            theme === 'system'
                              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Laptop className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                            <span>{t('THEME.SYSTEM')}</span>
                          </span>
                          {theme === 'system' && (
                            <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white stroke-[2.5]" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* 5. Đăng xuất (Cuối cùng khi đã đăng nhập) */}
                  {isLoggedIn && (
                    <div className="pt-1 mt-1 border-t border-gray-100 dark:border-zinc-800">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={_handleLogout}
                        className="w-full h-9 flex items-center justify-start gap-3 px-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span>{t('NAV.LOGOUT')}</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Address Selection & Creation Modal */}
      <DeliveryAddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
    </header>
  );
};
