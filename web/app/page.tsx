import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { ProductList } from '@/features/product';

export const metadata: Metadata = {
  title: 'Pizza Hut - Đặt Pizza & Món Ăn Nhanh Giao Tận Nơi',
  description: 'Thưởng thức thực đơn Pizza Hut nóng hổi, giòn tan, giao hàng tận nơi nhanh chóng trong 30 phút.',
};

export default function HomePage() {
  return (
    <MainLayout>
      <ProductList />
    </MainLayout>
  );
}
