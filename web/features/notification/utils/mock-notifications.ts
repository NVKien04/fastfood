import { NotificationItemData } from '../types';

export const INITIAL_MOCK_NOTIFICATIONS: NotificationItemData[] = [
  {
    id: 'notif-1',
    title: 'Đơn hàng #KP-2026 đang trên đường giao!',
    message: 'Tài xế Nguyễn Văn A đang giao Pizza Hải Sản Sốt Pesto & Coca-Cola tới địa chỉ của bạn. Dự kiến nhận hàng trong 15 phút nữa.',
    type: 'ORDER',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 phút trước
    linkUrl: '/checkout',
    metadata: {
      orderNumber: 'KP-2026',
    },
  },
  {
    id: 'notif-2',
    title: 'Tặng bạn Voucher 50.000đ từ KeiPizza 🍕',
    message: 'Nhập mã KEI50K khi thanh toán đơn hàng từ 250.000đ để được giảm trực tiếp 50K ngay hôm nay!',
    type: 'PROMO',
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 phút trước
    linkUrl: '/#combo',
    metadata: {
      discountCode: 'KEI50K',
      amount: 50000,
    },
  },
  {
    id: 'notif-3',
    title: 'Đơn hàng #KP-1892 đã hoàn tất thành công',
    message: 'Cảm ơn bạn đã lựa chọn KeiPizza! Đơn hàng của bạn đã hoàn thành và bạn vừa tích lũy thêm 35 điểm Kei Rewards.',
    type: 'ORDER',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 giờ trước
    linkUrl: '/profile',
    metadata: {
      orderNumber: 'KP-1892',
    },
  },
  {
    id: 'notif-4',
    title: 'Flash Sale: Mua 1 Tặng 1 Pizza Cỡ Vừa (M)',
    message: 'Khung giờ vàng 11:00 - 14:00 và 18:00 - 21:00 thứ Tư hàng tuần. Áp dụng cho dòng Pizza Truyền Thống & Cao Cấp.',
    type: 'PROMO',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
    linkUrl: '/#pizza',
  },
  {
    id: 'notif-5',
    title: 'Chào mừng bạn đến với KeiPizza!',
    message: 'Khám phá thực đơn phong phú với hơn 50 hương vị pizza, món ăn kèm giòn rụm và đồ uống mát lạnh.',
    type: 'SYSTEM',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 ngày trước
    linkUrl: '/',
  },
];
