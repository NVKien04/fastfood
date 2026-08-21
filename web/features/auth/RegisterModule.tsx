'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AuthHeader } from './components/AuthHeader';
import { RegisterForm } from './components/RegisterForm';

export const RegisterModule: FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans selection:bg-red-500 selection:text-white transition-colors">
      <AuthHeader />

      {/* Subheader */}
      <div className="max-w-[480px] w-full mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 -ml-2 rounded-lg hover:bg-gray-100/60 dark:hover:bg-zinc-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở lại</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center flex-1 pr-6">
          Tạo tài khoản
        </h1>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-4 sm:py-8">
        <div className="w-full max-w-[480px]">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
};
