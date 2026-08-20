'use client';

import { FC } from 'react';
import { useProfile } from './hooks/useProfile';
import { AvatarUpload } from './AvatarUpload';
import { ProfileForm } from './components/ProfileForm';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export const UserProfile: FC = () => {
  const {
    form,
    user,
    profileData,
    isProfileLoading,
    isUpdating,
    statusMessage,
    onSubmit,
  } = useProfile();

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-3" />
        <p className="text-xs font-semibold text-gray-500">Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl shadow-gray-200/40">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Hồ sơ cá nhân</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Quản lý và cập nhật thông tin tài khoản Pizza Hut của bạn
            </p>
          </div>

          <Badge className="bg-red-50 text-red-600 border-red-100 text-xs font-bold px-3 py-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="capitalize">{user?.roles?.[0] || 'Thành viên'}</span>
          </Badge>
        </div>

        {/* Avatar Upload Section */}
        <div className="mb-8">
          <AvatarUpload
            currentAvatar={profileData?.avatar || user?.avatar}
            userName={profileData?.name || user?.fullName || 'Người dùng'}
          />
        </div>

        {/* Profile Information Form */}
        <ProfileForm
          form={form}
          onSubmit={onSubmit}
          userEmail={profileData?.email || user?.email}
          isUpdating={isUpdating}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  );
};
