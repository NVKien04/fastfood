import { OrderResponseDto, OrderFilterTab, OrderTabCounts } from '../types';

export const PROCESSING_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_SHIPMENT'];

/**
 * Kiểm tra trạng thái đơn hàng có đang trong tiến trình xử lý / giao hàng không
 */
export const isProcessingStatus = (status: string): boolean => {
  return PROCESSING_STATUSES.includes(status);
};

/**
 * Kiểm tra đơn hàng có thể hủy được hay không (chỉ PENDING hoặc CONFIRMED)
 */
export const canCancelOrder = (status: string): boolean => {
  return status === 'PENDING' || status === 'CONFIRMED';
};

/**
 * Lọc danh sách đơn hàng theo Tab trạng thái và từ khóa tìm kiếm
 */
export const filterOrdersByTabAndQuery = (
  orders: OrderResponseDto[],
  activeTab: OrderFilterTab,
  searchQuery: string,
): OrderResponseDto[] => {
  let list = [...orders];

  // 1. Lọc theo tab
  if (activeTab === 'PROCESSING') {
    list = list.filter((o) => isProcessingStatus(o.status));
  } else if (activeTab === 'DELIVERED') {
    list = list.filter((o) => o.status === 'DELIVERED');
  } else if (activeTab === 'CANCELLED') {
    list = list.filter((o) => o.status === 'CANCELLED');
  }

  // 2. Lọc theo search query (mã đơn, số điện thoại, tên khách)
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.guestPhone && o.guestPhone.includes(q)) ||
        (o.guestName && o.guestName.toLowerCase().includes(q)),
    );
  }

  return list;
};

/**
 * Tính số lượng đơn hàng theo từng tab
 */
export const calculateOrderCountsByTab = (orders: OrderResponseDto[]): OrderTabCounts => {
  return {
    ALL: orders.length,
    PROCESSING: orders.filter((o) => isProcessingStatus(o.status)).length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
    CANCELLED: orders.filter((o) => o.status === 'CANCELLED').length,
  };
};
