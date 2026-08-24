'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Moon,
  Sun,
  Monitor,
  LogOut,
  User,
  Bell,
  Menu,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/stores';
import { ApiMain } from '@/services/apis/main/api.main';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LANGUAGES } from '@/constants';
import { ThemeEnum } from '@/constants/theme';
import { useIsMobile } from '@/hooks/use-mobile';

const BREADCRUMB_MAP: Record<string, string> = {
  '/': 'SIDEBAR.DASHBOARD',
  '/products': 'SIDEBAR.PRODUCTS',
  '/products/create': 'PRODUCTS.CREATE',
  '/categories': 'SIDEBAR.CATEGORIES',
  '/orders': 'SIDEBAR.ORDERS',
  '/users': 'SIDEBAR.USERS',
  '/coupons': 'SIDEBAR.COUPONS',
  '/ingredients': 'SIDEBAR.INGREDIENTS',
};

export const AdminHeader = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const user = useStore((s) => s.user);
  const theme = useStore((s) => s.theme);
  const locale = useStore((s) => s.locale);
  const updateTheme = useStore((s) => s.updateTheme);
  const updateLocale = useStore((s) => s.updateLocale);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const clearAuth = useStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      await ApiMain.instance.auth.logout();
    } catch {
      // ignore
    }
    clearAuth();
    document.cookie = 'logged_in=; Max-Age=0; path=/';
    router.push('/login');
  };

  const themeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const ThemeIcon = themeIcon;

  // Build breadcrumbs
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [
    { label: t('SIDEBAR.DASHBOARD'), href: '/' },
  ];

  if (segments.length > 0) {
    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const key = BREADCRUMB_MAP[currentPath];
      if (key) {
        breadcrumbs.push({ label: t(key), href: currentPath });
      } else {
        breadcrumbs.push({ label: segment, href: currentPath });
      }
    });
  }

  const currentLang = LANGUAGES.find((l) => l.code === locale);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Left side: hamburger + breadcrumbs */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <nav className="flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground cursor-pointer transition-colors'
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Right side: notifications + theme + language + user */}
      <div className="flex items-center gap-1">
        {/* Notification */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ThemeIcon className="h-5 w-5" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => updateTheme(ThemeEnum.LIGHT)}>
              <Sun className="mr-2 h-4 w-4" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateTheme(ThemeEnum.DARK)}>
              <Moon className="mr-2 h-4 w-4" /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateTheme(ThemeEnum.SYSTEM)}>
              <Monitor className="mr-2 h-4 w-4" /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1 px-2">
                <span className="text-base">{currentLang?.flag}</span>
                {!isMobile && <span className="text-xs">{currentLang?.code.toUpperCase()}</span>}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem key={lang.code} onClick={() => updateLocale(lang.code)}>
                <span className="mr-2">{lang.flag}</span> {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.fullName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.fullName || 'Admin'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" /> Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> {t('AUTH.LOGOUT')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
