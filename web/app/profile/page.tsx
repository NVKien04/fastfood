import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { UserProfile } from '@/modules/profile';

export const metadata: Metadata = {
  title: 'Hồ Sơ Cá Nhân | Pizza Hut',
  description: 'Quản lý thông tin cá nhân và tài khoản Pizza Hut.',
};

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="py-6">
        <UserProfile />
      </div>
    </MainLayout>
  );
}
