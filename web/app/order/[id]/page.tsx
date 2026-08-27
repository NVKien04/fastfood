import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { OrderDetailModule } from '@/features/orders';

export const metadata: Metadata = {
  title: 'Chi Tiết Đơn Hàng | FastFood',
  description: 'Xem chi tiết tiến trình và thông tin đơn hàng tại FastFood.',
};

export default function OrderSinglePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <MainLayout>
      <div className="py-4 sm:py-6">
        <OrderDetailModule params={params} />
      </div>
    </MainLayout>
  );
}
