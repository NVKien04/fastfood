'use client';

import { FC } from 'react';
import { AuthHeader } from './components/AuthHeader';
import { LoginForm } from './components/LoginForm';

export const LoginModule: FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-gray-900 font-sans selection:bg-red-500 selection:text-white">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[420px]">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};
