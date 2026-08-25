import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { NotFoundModule } from '@/features/not-found';

export const metadata: Metadata = {
  title: '404 - Không Tìm Thấy Trang | FastFood',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
};

export default function NotFoundPage() {
  return (
    <MainLayout>
      <NotFoundModule />
    </MainLayout>
  );
}
