import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { ProductList } from '@/features/product';

export const metadata: Metadata = {
  title: 'Thực Đơn Pizza & Món Ăn Nhanh | Pizza Hut',
  description:
    'Khám phá thực đơn phong phú từ Pizza Hut: Pizza, The Melts, Món khai vị, Đồ uống và tráng miệng hấp dẫn.',
};

export default function ProductPage() {
  return (
    <MainLayout>
      <ProductList />
    </MainLayout>
  );
}
