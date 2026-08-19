'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Bell, ShoppingCart, Menu, User as UserIcon, MapPin, ChevronDown, LogOut, UserCheck } from 'lucide-react';
import { useStore } from '@/stores';
import { ApiMain } from '@/services/apis/main/api.main';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
  const { t } = useTranslation();

  // 3. Local state & refs
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState<boolean>(false);
  const userMenuRef = React.useRef<HTMLDivElement | null>(null);

  // 4. Zustand global state
  const user = useStore((s) => s.user);
  const accessToken = useStore((s) => s.accessToken);
  const cartTotalCount = useStore((s) => s.getTotalCount());

  // 5. React Query hooks (none in header)

  // 6. Memoized values (useMemo)
  const isLoggedIn = React.useMemo(() => !!accessToken, [accessToken]);

  const userDisplayName = React.useMemo(() => {
    if (!user) return '';
    return user.fullName || user.email || 'Người dùng';
  }, [user]);

  // 7. Effects (useEffect)
  React.useEffect(() => {
    const _handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', _handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', _handleClickOutside);
    };
  }, []);

  // 8. Event handlers & internal functions (useCallback)
  const _handleToggleUserMenu = React.useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  const _handleNavigate = React.useCallback(
    (path: string) => {
      setIsUserMenuOpen(false);
      router.push(path);
    },
    [router],
  );

  const _handleLogout = React.useCallback(async () => {
    setIsUserMenuOpen(false);
    try {
      await ApiMain.instance.auth.logout();
    } catch {
      // ignore logout API error on client side cleanup
    } finally {
      useStore.getState().clearAuth();
      router.push('/login');
    }
  }, [router]);

  // 9. Return JSX
  return (
    <header
      className={`sticky top-0 z-40 w-full h-[72px] min-h-[72px] max-h-[72px] bg-white border-b border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all ${className}`}
    >
      {/* 1. Left Section: Delivery Address */}
      <div className="flex items-center gap-2 min-w-0 max-w-[280px] sm:max-w-xs lg:max-w-sm">
        <div
          onClick={onAddressClick}
          className="flex flex-col text-left cursor-pointer group hover:opacity-80 transition-opacity select-none"
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>{t('CHECKOUT.DELIVERY_INFO', 'Giao hàng tới:')}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-gray-800 group-hover:text-red-600 transition-colors">
            <span className="truncate">{deliveryAddress}</span>
            <ChevronDown className="w-3 h-3 text-gray-400 shrink-0 group-hover:text-red-600" />
          </div>
        </div>
      </div>

      {/* 2. Center Section: Pizza Hut Logo */}
      <div className="flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
          {/* Pizza Hut Style Red Badge Logo */}
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shadow-md shadow-red-600/20">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.55.45-1 1-1h14c.55 0 1 .45 1 1 0 4.41-3.59 8-8 8zm6.5-10H5.5c-.45-1.92 1.4-3.5 3.5-3.5h6c2.1 0 3.95 1.58 3.5 3.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-gray-900 leading-none">
              Pizza<span className="text-red-600 font-black">Hut</span>
            </span>
          </div>
        </Link>
      </div>

      {/* 3. Right Section: Notifications, Language, Cart, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="sr-only">Thông báo</span>
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher variant="compact" />

        {/* Cart Pill Button */}
        <Link
          href="/checkout"
          className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-full border border-gray-200 bg-white hover:border-red-500 hover:text-red-600 text-gray-800 text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <span className="font-extrabold text-sm">{cartTotalCount}</span>
          <ShoppingCart className="w-4 h-4 text-gray-700 hover:text-red-600" />
        </Link>

        {/* User Profile / Menu Pill Button */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={_handleToggleUserMenu}
            className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-all active:scale-95"
          >
            <Menu className="w-4 h-4 text-gray-600" />
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 overflow-hidden">
              {isLoggedIn && user?.avatar ? (
                <img src={user.avatar} alt={userDisplayName} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-gray-600" />
              )}
            </div>
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{userDisplayName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => _handleNavigate('/profile')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-gray-500" />
                    <span>{t('NAV.PROFILE', 'Tài khoản của tôi')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => _handleNavigate('/checkout')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 text-gray-500" />
                    <span>{t('NAV.CART', 'Giỏ hàng')}</span>
                  </button>

                  <div className="my-1 border-t border-gray-50" />

                  <button
                    type="button"
                    onClick={_handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>{t('NAV.LOGOUT', 'Đăng xuất')}</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs text-gray-500">
                    Chào mừng bạn đến với Pizza Hut
                  </div>
                  <button
                    type="button"
                    onClick={() => _handleNavigate('/login')}
                    className="w-full flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                  >
                    {t('AUTH.LOGIN_BUTTON', 'Đăng nhập / Đăng ký')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
