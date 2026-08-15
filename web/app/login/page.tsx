'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ApiMain } from '@/services/apis/main/api.main';
import { useStore } from '@/stores';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await ApiMain.instance.auth.login({ email, password });

      if (response.kind === 'OK' && response.data.accessToken) {
        // Lưu token vào store
        useStore.getState().setAccessToken(response.data.accessToken);
        // Chuyển hướng về trang chủ
        router.push('/');
      } else if (response.kind === 'ERROR') {
        setError(response.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      } else {
        setError('Đăng nhập thất bại.');
      }
    } catch (err: unknown) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-brand-canvas px-4 py-12 md:py-24 font-sans select-none h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-8 animate-fade-in">
        {/* Asterisk radial-spike mark SVG */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-brand-primary animate-pulse">
          <path d="M12 2c-.6 0-1 .4-1 1v7.6L5.4 6c-.4-.4-1.1-.4-1.5 0s-.4 1.1 0 1.5L9.5 13H3c-.6 0-1 .4-1 1s.4 1 1 1h6.5l-5.6 5.6c-.4.4-.4 1.1 0 1.5s1.1.4 1.5 0l5.6-5.6V21c0 .6.4 1 1 1s1-.4 1-1v-7.6l5.6 5.6c.4.4 1.1.4 1.5 0s.4-1.1 0-1.5L14.5 15H21c.6 0 1-.4 1-1s-.4-1-1-1h-6.5l5.6-5.6c.4-.4.4-1.1 0-1.5s-1.1-.4-1.5 0L13 10.6V3c0-.6-.4-1-1-1z" />
        </svg>
        <span className="text-2xl font-bold text-brand-ink tracking-tight">FastFood</span>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-[420px] bg-brand-surface-card border border-brand-hairline shadow-[0_4px_20px_rgba(20,20,19,0.04)] rounded-xl overflow-hidden p-6 md:p-8 animate-slide-up">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-3xl font-bold text-brand-ink tracking-tight">Sign in</CardTitle>
          <CardDescription className="text-brand-body text-sm mt-2">
            Use your email and password to access your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-0 flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md border border-red-100">{error}</div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="email" className="text-sm font-medium text-brand-body-strong">
                  Email address
                </Label>
              </div>
              <Input
                id="email"
                type="email"
                required
                placeholder="me@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-brand-hairline text-brand-ink placeholder:text-brand-muted-soft hover:border-brand-primary focus-visible:border-brand-primary-active focus-visible:ring-0 h-auto py-3 pl-5 pr-4 rounded-md text-base font-normal transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-brand-body-strong">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-brand-primary hover:text-brand-primary-active hover:underline transition-colors font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-brand-hairline text-brand-ink placeholder:text-brand-muted-soft hover:border-brand-primary focus-visible:border-brand-primary-active focus-visible:ring-0 h-auto py-3 pl-5 pr-4 rounded-md text-base font-normal transition-all"
              />
            </div>
          </CardContent>

          <CardFooter className="p-0 mt-8 flex flex-col gap-4">
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-brand-primary-active text-white text-base font-medium h-auto py-3 px-6 rounded-lg shadow-sm active:translate-y-[1px] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-xs text-brand-muted mt-2">
              <a
                href="#"
                className="text-brand-primary hover:text-brand-primary-active hover:underline transition-colors font-medium"
              >
                Sign up
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
