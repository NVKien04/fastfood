import { Metadata } from 'next';
import { MainLayout } from '@/components/layout';
import { MyOrders } from '@/features/orders';

export const metadata: Metadata = {
  title: 'Đơn Hàng Của Tôi | FastFood',
  description: 'Theo dõi tiến trình đơn hàng và lịch sử đặt món của bạn tại FastFood.',
};

export default function OrdersPage() {
  return (
    <MainLayout>
      <div className="py-4 sm:py-6">
        <MyOrders />
      </div>
    </MainLayout>
  );
}
