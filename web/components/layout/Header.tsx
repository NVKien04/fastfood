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
  LogOut,
  UserCheck,
  ShoppingBag,
  Sun,
  Moon,
  Laptop,
  Check,
  Globe,
  Palette,
  Utensils,
  Tag,
  MapPin,
  PhoneCall,
  Info,
} from 'lucide-react';
import { useStore } from '@/stores';
import { THEME, LanguageEnum, Language } from '@/constants';
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
  const menuRef = React.useRef<HTMLDivElement | null>(null);

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
    return user.fullName || user.email || 'Người dùng';
  }, [user]);

  const currentLanguage = i18n.language || 'vi';

  // 6. Effects (handle click outside menu)
  React.useEffect(() => {
    const _handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
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
  }, []);

  const _handleNavigate = React.useCallback(
    (path: string) => {
      setIsMenuOpen(false);
      router.push(path);
    },
    [router],
  );

  const _handleLogout = React.useCallback(async () => {
    setIsMenuOpen(false);
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
  };

  const _handleThemeChange = (newTheme: THEME) => {
    updateTheme(newTheme);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full h-[110px] min-h-[110px] max-h-[110px] bg-white dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-colors ${className}`}
    >
      <div className="max-w-[1200px] w-full h-full mx-auto px-4 flex items-center justify-between gap-4">
        {/* ========================================================= */}
        {/* Left Side: Brand (1) and Delivery Address (2) next to each other */}
        {/* ========================================================= */}
        <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 min-w-0">
          {/* 1. Logo + Brand "KeiPizza" + Short Subtitle */}
          <Link href="/" className="flex items-center gap-3.5 group select-none shrink-0">
            {/* Logo Badge */}
            <div className="w-12 h-12 rounded-full bg-[#ff6900] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.45-1 1-1h14c.55 0 1 .45 1 1 0 4.41-3.59 8-8 8zm6.5-10H5.5c-.45-1.92 1.4-3.5 3.5-3.5h6c2.1 0 3.95 1.58 3.5 3.5z" />
              </svg>
            </div>

            {/* Brand Name & Short Description */}
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
        {/* 3. Right Section: Notification, Orange Cart, Menu Dropdown */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification Bell */}
          <button
            type="button"
            aria-label="Thông báo"
            className="relative p-2.5 rounded-full text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff6900]" />
          </button>

          {/* Orange Cart Pill Button */}
          <Link
            href="/checkout"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff6900] hover:bg-[#e05d00] active:scale-95 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer select-none"
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

          {/* Menu Dropdown Trigger Button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={_handleToggleMenu}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer select-none"
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

            {/* Comprehensive Navigation & Settings Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-72 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl shadow-black/10 dark:shadow-black/60 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 transition-colors select-none">
                {/* 1. User Header Section */}
                <div className="pb-3 border-b border-gray-100 dark:border-zinc-800">
                  {isLoggedIn ? (
                    <div className="px-2 py-1.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#ff6900] font-black flex items-center justify-center overflow-hidden shrink-0">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={userDisplayName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{userDisplayName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{userDisplayName}</p>
                        <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 px-1 py-1">
                      <p className="text-xs text-gray-500 dark:text-zinc-400">Chào mừng bạn đến với KeiPizza</p>
                      <button
                        type="button"
                        onClick={() => _handleNavigate('/login')}
                        className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-[#ff6900] hover:bg-[#e05d00] rounded-xl transition-colors shadow-xs cursor-pointer"
                      >
                        {t('AUTH.LOGIN_BUTTON', 'Đăng nhập / Đăng ký')}
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Main Navigation Menu Links */}
                <div className="py-2 space-y-0.5 border-b border-gray-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => _handleNavigate('/')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
                  >
                    <Utensils className="w-4 h-4 text-[#ff6900]" />
                    <span>Thực đơn món ăn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => _handleNavigate('/#combo')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
                  >
                    <Tag className="w-4 h-4 text-[#ff6900]" />
                    <span>Ưu đãi &amp; Khuyến mãi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => _handleNavigate('/checkout')}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#ff6900]" />
                    <span>Đơn hàng &amp; Giỏ của bạn</span>
                  </button>

                  {isLoggedIn && (
                    <button
                      type="button"
                      onClick={() => _handleNavigate('/profile')}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-[#ff6900]" />
                      <span>Hồ sơ tài khoản</span>
                    </button>
                  )}

                  <a
                    href="tel:19001822"
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#ff6900]" />
                    <span>Tổng đài đặt hàng: 1900 1822</span>
                  </a>
                </div>

                {/* 3. Settings: Language & Theme */}
                <div className="py-2.5 space-y-2 border-b border-gray-100 dark:border-zinc-800">
                  {/* Language */}
                  <div>
                    <div className="flex items-center gap-1.5 px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                      <Globe className="w-3 h-3" />
                      <span>Ngôn ngữ</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => _handleLanguageChange(LanguageEnum.VI)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          currentLanguage.startsWith('vi')
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] font-bold'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>🇻🇳</span>
                          <span>Tiếng Việt</span>
                        </span>
                        {currentLanguage.startsWith('vi') && <Check className="w-3.5 h-3.5 text-[#ff6900]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => _handleLanguageChange(LanguageEnum.EN)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          currentLanguage.startsWith('en')
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] font-bold'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>🇬🇧</span>
                          <span>English</span>
                        </span>
                        {currentLanguage.startsWith('en') && <Check className="w-3.5 h-3.5 text-[#ff6900]" />}
                      </button>
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <div className="flex items-center gap-1.5 px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                      <Palette className="w-3 h-3" />
                      <span>Giao diện</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => _handleThemeChange('light')}
                        className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                          theme === 'light'
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] font-bold border border-orange-200 dark:border-orange-900'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Sáng</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => _handleThemeChange('dark')}
                        className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] font-bold border border-orange-200 dark:border-orange-900'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Tối</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => _handleThemeChange('system')}
                        className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                          theme === 'system'
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff6900] font-bold border border-orange-200 dark:border-orange-900'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Hệ thống</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Logout Action if Logged In */}
                {isLoggedIn && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={_handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>{t('NAV.LOGOUT', 'Đăng xuất tài khoản')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
