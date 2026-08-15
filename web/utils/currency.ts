/**
 * Format số tiền sang định dạng tiền Việt Nam (VNĐ)
 * @param price - Số tiền cần format
 * @returns Chuỗi tiền tệ định dạng VNĐ (ví dụ: "50.000 đ")
 */
export const formatVND = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
    .format(price)
    .replace('₫', 'đ');
};
