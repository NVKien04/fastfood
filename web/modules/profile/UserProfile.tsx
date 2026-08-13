'use client';

import * as React from 'react';
import { ApiMain } from '@/services/apis/main/api.main';
import { UserResponseDto } from '@/services/apis/main/generated/data-contracts';
import { useAuthStore } from '@/stores/auth.store';
import { AvatarUpload } from './AvatarUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [profileData, setProfileData] = React.useState<UserResponseDto | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false);
  const [statusMessage, setStatusMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [name, setName] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');

  // Fetch full profile info from backend
  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    const response = await ApiMain.instance.user.getProfile();
    if (response.kind === 'OK' && response.data) {
      const data = response.data;
      setProfileData(data);
      setName(data.name || '');
      setPhone(data.phone || '');

      // Sync Zustand store using current state snapshot
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({
          ...currentUser,
          fullName: data.name || currentUser.fullName,
          avatar: data.avatar || currentUser.avatar,
        });
      }
    }
    setLoading(false);
  }, [setUser]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Save profile changes (name, phone)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const res = await ApiMain.instance.user.updateProfile({
      name,
      phone,
    });

    if (res.kind === 'OK' && res.data) {
      setProfileData(res.data);
      if (user) {
        setUser({
          ...user,
          fullName: res.data.name || name,
        });
      }
      setStatusMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Cập nhật thất bại. Vui lòng thử lại.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-sm font-medium">Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  const activeName = profileData?.name || user?.fullName || 'Người dùng';
  const activeEmail = profileData?.email || user?.email || '';
  const activeAvatar = profileData?.avatar || user?.avatar || '';
  const activeRole = profileData?.role || (user?.roles?.[0] ?? 'CUSTOMER');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <span>Hồ Sơ Cá Nhân</span>
          <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
        </h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý thông tin tài khoản và ảnh đại diện của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar Upload Card */}
        <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 w-full text-center">
              Ảnh Đại Diện
            </h2>

            <AvatarUpload
              currentAvatar={activeAvatar}
              userName={activeName}
              onAvatarChange={(newUrl) => {
                setProfileData((prev) => (prev ? { ...prev, avatar: newUrl } : null));
              }}
            />

            <div className="mt-6 text-center">
              <h3 className="text-lg font-black text-gray-900 leading-snug">{activeName}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{activeEmail}</p>

              <Badge className="mt-3 bg-red-50 text-red-700 border-red-200 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-red-600" />
                <span>{activeRole}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-red-600" />
            <span>Thông Tin Cá Nhân</span>
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                Họ và Tên
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                  className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-white font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Email Address (Read-only) */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                Địa Chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  value={activeEmail}
                  disabled
                  className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Email không thể thay đổi</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                Số Điện Thoại
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500/20 bg-white font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Status Feedback Message */}
            {statusMessage && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 animate-fadeIn ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2.5 text-xs font-bold shadow-lg shadow-red-600/20 active:scale-95 transition-all flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Đang lưu thay đổi...' : 'Lưu Thay Đổi'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
