export interface UserCouponInfo {
  id: string;
  isUsed: number;
  userId: string;
  couponsId: string;
  createdAt: Date;
  updatedAt: Date;
  coupon: {
    id: string;
    code: string;
    name: string;
    description: string;
    value: number;
    minOrderAmount: number;
    startDate: Date;
    endDate: Date;
    isActive: number;
  };
}

export interface IUserCouponRepository {
  /**
   * Lấy danh sách coupon của user kèm thông tin coupon
   */
  findByUserId(userId: string): Promise<UserCouponInfo[]>;

  /**
   * Đánh dấu exclusive coupon đã sử dụng
   */
  markAsUsed(userId: string, couponId: string): Promise<boolean>;

  /**
   * Kiểm tra user đã sử dụng coupon exclusive này chưa
   */
  isUsedByUser(userId: string, couponId: string): Promise<boolean>;
}
