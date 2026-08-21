'use client';

import { FC, Suspense } from 'react';
import { AuthHeader } from './components/AuthHeader';
import { LoginForm } from './components/LoginForm';

export const LoginModule: FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans selection:bg-red-500 selection:text-white transition-colors">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px]">
          <Suspense fallback={<div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-8 text-center text-sm text-gray-400 dark:text-zinc-500 animate-pulse">Đang tải...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
};
