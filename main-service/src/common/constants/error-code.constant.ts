/**
 * Mã lỗi nghiệp vụ tập trung cho toàn dự án.
 * Định dạng: 'CODE:MESSAGE:HTTP_STATUS'
 *
 * - CODE: Mã lỗi nghiệp vụ nội bộ (number)
 * - MESSAGE: Thông báo lỗi hiển thị cho người dùng (string)
 * - HTTP_STATUS: Mã HTTP Status Code tương ứng (number)
 */
export enum ErrorEnum {
  // ========== Auth & User (1001 - 1099) ==========
  USER_EXISTED = '1001:Email đã tồn tại trong hệ thống:409',
  USER_NOT_FOUND = '1002:Người dùng không tồn tại:404',
  INVALID_USERNAME_PASSWORD = '1003:Email hoặc mật khẩu không chính xác:401',
  INVALID_TOKEN = '1004:Token không hợp lệ:401',
  TOKEN_EXPIRED = '1005:Token đã hết hạn:401',

  // ========== Authorization (1100 - 1199) ==========
  NO_PERMISSION = '1101:Không có quyền truy cập:403',

  // ========== Product & Category (2001 - 2099) ==========
  PRODUCT_NOT_FOUND = '2001:Sản phẩm không tồn tại:404',
  PRODUCT_SLUG_EXISTED = '2002:Sản phẩm với slug này đã tồn tại:409',
  CATEGORY_NOT_FOUND = '2003:Danh mục không tồn tại:404',
  CATEGORY_EXISTED = '2005:Danh mục đã tồn tại:409',
  INGREDIENT_NOT_FOUND = '2004:Nguyên liệu không tồn tại:404',

  // ========== Cart & Order (3001 - 3099) ==========
  CART_EMPTY = '3001:Giỏ hàng trống:400',
  ORDER_NOT_FOUND = '3002:Đơn hàng không tồn tại:404',

  // ========== Coupon (4001 - 4099) ==========
  COUPON_NOT_FOUND = '4001:Mã giảm giá không tồn tại:404',
  COUPON_EXPIRED = '4002:Mã giảm giá đã hết hạn:400',

  // ========== Address (5001 - 5099) ==========
  ADDRESS_NOT_FOUND = '5001:Địa chỉ không tồn tại:404',

  // ========== Review (6001 - 6099) ==========
  REVIEW_ALREADY_EXISTS = '6001:Đơn hàng đã được đánh giá:409',
  ORDER_NOT_FOUND_OR_REVIEWED = '6002:Đơn hàng không tồn tại hoặc đã được đánh giá:404',

  // ========== Combo (8001 - 8099) ==========
  COMBO_NOT_FOUND = '8001:Combo không tồn tại:404',

  // ========== General (9001 - 9099) ==========
  VALIDATION_ERROR = '9001:Dữ liệu không hợp lệ:400',
  INTERNAL_ERROR = '9999:Hệ thống đang có lỗi:500',
}
