'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Ticket,
  Salad,
  ChevronLeft,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';
import { useStore } from '@/stores';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: ROUTES.DASHBOARD, icon: LayoutDashboard, labelKey: 'SIDEBAR.DASHBOARD' },
  { href: ROUTES.PRODUCTS, icon: Package, labelKey: 'SIDEBAR.PRODUCTS' },
  { href: ROUTES.CATEGORIES, icon: FolderOpen, labelKey: 'SIDEBAR.CATEGORIES' },
  { href: ROUTES.ORDERS, icon: ShoppingCart, labelKey: 'SIDEBAR.ORDERS' },
  { href: ROUTES.USERS, icon: Users, labelKey: 'SIDEBAR.USERS' },
  { href: ROUTES.COUPONS, icon: Ticket, labelKey: 'SIDEBAR.COUPONS' },
  { href: ROUTES.INGREDIENTS, icon: Salad, labelKey: 'SIDEBAR.INGREDIENTS' },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const collapsed = useStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delay={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
          collapsed ? 'w-[68px]' : 'w-[260px]',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-sidebar-foreground">FastFood</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
                  Admin Panel
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const label = t(item.labelKey);

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary shadow-sm'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                  collapsed && 'justify-center px-0',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    active ? 'text-sidebar-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80',
                  )}
                />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger render={linkContent} />
                  <TooltipContent side="right" className="font-medium">
                    {label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              'w-full text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              collapsed && 'px-0',
            )}
          >
            <ChevronLeft
              className={cn('h-4 w-4 shrink-0 transition-transform duration-300', collapsed && 'rotate-180')}
            />
            {!collapsed && <span className="ml-2 text-xs">Thu gọn</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};
