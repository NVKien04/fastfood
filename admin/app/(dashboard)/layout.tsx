'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/stores';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const collapsed = useStore((s) => s.sidebarCollapsed);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          collapsed ? 'ml-[68px]' : 'ml-[260px]',
        )}
      >
        <AdminHeader />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
