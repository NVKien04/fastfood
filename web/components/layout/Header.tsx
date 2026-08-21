'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Bell,
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
  Globe,
  Palette,
  PackageSearch,
  Headphones,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useStore } from '@/stores';
import { THEME, LANGUAGES, LanguageEnum, type Language } from '@/constants';
import { ApiMain } from '@/services/apis/main/api.main';
import { formatVND } from '@/utils';

type HeaderProps = {
  className?: string;
  deliveryAddress?: string;
  onAddressClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  className = '',
  deliveryAddress = 'Đường Trương Định/Ngõ 58 Tổ 10D, Tương Mai, Hoàng Mai, Hà Nội',
  onAddressClick,
}) => {
  // 1. Next.js Router & navigation hooks
  const router = useRouter();

  // 2. Translation hook
  const { t, i18n } = useTranslation();

  // 3. Local state & refs
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const [isLanguageOpen, setIsLanguageOpen] = React.useState<boolean>(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = React.useState<boolean>(false);

  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const languageRef = React.useRef<HTMLDivElement | null>(null);

  // 4. Zustand global state
  const user = useStore((s) => s.user);
  const accessToken = useStore((s) => s.accessToken);
  const cartTotalCount = useStore((s) => s.getTotalCount());
  const cartTotalPrice = useStore((s) => s.getTotalPrice());
  const theme = useStore((s) => s.theme);
  const updateTheme = useStore((s) => s.updateTheme);
  const updateLocale = useStore((s) => s.updateLocale);

  // 5. Memoized values
  const isLoggedIn = React.useMemo(() => !!accessToken, [accessToken]);

  const userDisplayName = React.useMemo(() => {
    if (!user) return '';
    return user.fullName || user.email || 'Tài khoản';
  }, [user]);

  const currentLanguage = (i18n.language || 'vi').toLowerCase();

  const currentLangLabel = React.useMemo(() => {
    if (currentLanguage.startsWith('en')) return 'EN';
    if (currentLanguage.startsWith('ja')) return 'JA';
    return 'VI';
  }, [currentLanguage]);

  const currentThemeLabel = React.useMemo(() => {
    switch (theme) {
      case 'light':
        return 'Sáng';
      case 'dark':
        return 'Tối';
      case 'system':
      default:
        return 'Hệ thống';
    }
  }, [theme]);

  // 6. Effects (handle click outside menus)
  React.useEffect(() => {
    const _handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
        setIsThemeSubmenuOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(target)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', _handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', _handleClickOutside);
    };
  }, []);

  // 7. Event handlers
  const _handleToggleMenu = React.useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    setIsThemeSubmenuOpen(false);
  }, []);

  const _handleToggleLanguage = React.useCallback(() => {
    setIsLanguageOpen((prev) => !prev);
  }, []);

  const _handleNavigate = React.useCallback(
    (path: string) => {
      setIsMenuOpen(false);
      setIsThemeSubmenuOpen(false);
      router.push(path);
    },
    [router],
  );

  const _handleLogout = React.useCallback(async () => {
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

  const _handleLanguageChange = (lang: Language) => {
    updateLocale(lang);
    setIsLanguageOpen(false);
  };

  const _handleThemeChange = (newTheme: THEME) => {
    updateTheme(newTheme);
    setIsThemeSubmenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full h-[110px] min-h-[110px] max-h-[110px] bg-white dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-colors ${className}`}
    >
      <div className="max-w-[1200px] w-full h-full mx-auto px-4 flex items-center justify-between gap-4">
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
              <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
                1510 cửa hàng tại 27 quốc gia
              </span>
            </div>
          </Link>

          {/* 2. Delivery Address Information */}
          <div
            onClick={onAddressClick}
            className="hidden md:flex flex-col text-left cursor-pointer group hover:opacity-90 transition-opacity select-none min-w-0 max-w-[260px] lg:max-w-xs"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-gray-900 dark:text-white">
              <span className="shrink-0">Giao pizza tới:</span>
              <span className="text-[#ff6900] group-hover:underline truncate">{deliveryAddress}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 group-hover:text-[#ff6900] transition-colors shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
              <span className="font-bold text-gray-800 dark:text-zinc-300">34 phút</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-bold">4.8 ★</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Right Side: Notification, Language Dropdown, Cart, User Menu */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Notification Bell */}
          <button
            type="button"
            aria-label="Thông báo"
            className="relative p-2.5 rounded-full text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff6900]" />
          </button>

          {/* ========================================================= */}
          {/* Language Selector (Tách ra bên ngoài Header) */}
          {/* ========================================================= */}
          <div className="relative" ref={languageRef}>
            <button
              type="button"
              onClick={_handleToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-200 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer select-none"
              aria-label="Chọn ngôn ngữ"
            >
              <Globe className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
              <span className="tracking-wide font-extrabold">{currentLangLabel}</span>
              <ChevronDown
                className={`w-3 h-3 text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${
                  isLanguageOpen ? 'rotate-180 text-gray-900 dark:text-white' : ''
                }`}
              />
            </button>

            {/* Language Dropdown Menu (Trắng đen tối giản) */}
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl shadow-black/10 dark:shadow-black/60 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none">
                <div className="space-y-0.5">
                  {LANGUAGES.map((lang) => {
                    const isSelected =
                      currentLanguage === lang.code ||
                      (lang.code === LanguageEnum.VI && currentLanguage.startsWith('vi')) ||
                      (lang.code === LanguageEnum.EN && currentLanguage.startsWith('en')) ||
                      (lang.code === LanguageEnum.JA && currentLanguage.startsWith('ja'));

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => _handleLanguageChange(lang.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-bold'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm leading-none">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Orange Cart Pill Button */}
          <Link
            href="/checkout"
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#ff6900] hover:bg-[#e05d00] active:scale-95 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer select-none"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>
              {cartTotalPrice > 0
                ? formatVND(cartTotalPrice)
                : cartTotalCount > 0
                  ? `${cartTotalCount} món`
                  : 'Giỏ hàng'}
            </span>
          </Link>

          {/* ========================================================= */}
          {/* User / Navigation Menu Trigger Button */}
          {/* ========================================================= */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={_handleToggleMenu}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer select-none"
            >
              <Menu className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-300 overflow-hidden">
                {isLoggedIn && user?.avatar ? (
                  <img src={user.avatar} alt={userDisplayName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400" />
                )}
              </div>
            </button>

            {/* ========================================================= */}
            {/* User Dropdown Menu (Màu sắc tối giản Trắng Đen) */}
            {/* ========================================================= */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl shadow-black/10 dark:shadow-black/60 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 select-none">
                <div className="space-y-0.5">
                  {/* 1. Trạng thái Auth: Tài khoản (auth=true) hoặc Đăng nhập/Đăng ký (auth=false) */}
                  {isLoggedIn ? (
                    /* Khi đã đăng nhập: Mục "Tài khoản" dạng list item đơn giản */
                    <button
                      type="button"
                      onClick={() => _handleNavigate('/profile')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                      <span className="truncate">{userDisplayName || 'Tài khoản'}</span>
                    </button>
                  ) : (
                    /* Khi chưa đăng nhập: Mục "Đăng nhập" & "Đăng ký" */
                    <>
                      <button
                        type="button"
                        onClick={() => _handleNavigate('/login')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogIn className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                        <span>Đăng nhập</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => _handleNavigate('/register')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                        <span>Đăng ký</span>
                      </button>
                    </>
                  )}

                  {/* 2. Theo dõi đơn hàng */}
                  <button
                    type="button"
                    onClick={() => _handleNavigate(isLoggedIn ? '/profile' : '/checkout')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <PackageSearch className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                    <span>Theo dõi đơn hàng</span>
                  </button>

                  {/* 3. Hỗ trợ khách hàng */}
                  <a
                    href="tel:19001822"
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                    <span>Hỗ trợ khách hàng</span>
                  </a>

                  {/* 4. Giao diện (Menu Cấp 2) */}
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => setIsThemeSubmenuOpen((prev) => !prev)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                        isThemeSubmenuOpen
                          ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Palette className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
                        <span>Giao diện</span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-zinc-400">
                        <span>{currentThemeLabel}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isThemeSubmenuOpen ? 'rotate-90 text-gray-900 dark:text-white' : ''
                          }`}
                        />
                      </span>
                    </button>

                    {/* Submenu cấp 2 mở rộng bên dưới */}
                    {isThemeSubmenuOpen && (
                      <div className="mt-1 ml-2 pl-2 border-l border-gray-200 dark:border-zinc-800 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Sáng */}
                        <button
                          type="button"
                          onClick={() => _handleThemeChange('light')}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            theme === 'light'
                              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-bold'
                              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Sun className="w-3.5 h-3.5" />
                            <span>Sáng</span>
                          </span>
                          {theme === 'light' && <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white stroke-[2.5]" />}
                        </button>

                        {/* Tối */}
                        <button
                          type="button"
                          onClick={() => _handleThemeChange('dark')}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            theme === 'dark'
                              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-bold'
                              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Moon className="w-3.5 h-3.5" />
                            <span>Tối</span>
                          </span>
                          {theme === 'dark' && <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white stroke-[2.5]" />}
                        </button>

                        {/* Hệ thống */}
                        <button
                          type="button"
                          onClick={() => _handleThemeChange('system')}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            theme === 'system'
                              ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-bold'
                              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Laptop className="w-3.5 h-3.5" />
                            <span>Hệ thống</span>
                          </span>
                          {theme === 'system' && <Check className="w-3.5 h-3.5 text-gray-900 dark:text-white stroke-[2.5]" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 5. Đăng xuất (Cuối cùng khi đã đăng nhập) */}
                  {isLoggedIn && (
                    <div className="pt-1 mt-1 border-t border-gray-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={_handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span>{t('NAV.LOGOUT', 'Đăng xuất')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
