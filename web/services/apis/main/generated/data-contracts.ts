/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Vai trò người dùng */
export enum RoleEnum {
  Admin = 'admin',
  Customer = 'customer',
}

export interface UserResponseDto {
  /**
   * ID người dùng
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  id: string;
  /**
   * Email người dùng
   * @example "user@example.com"
   */
  email: string;
  /**
   * Họ và tên
   * @example "Nguyễn Văn A"
   */
  name: string;
  /**
   * Số điện thoại
   * @example "0987654321"
   */
  phone?: string;
  /**
   * Ảnh đại diện
   * @example "https://example.com/avatar.png"
   */
  avatar?: string;
  /**
   * Vai trò người dùng
   * @example "customer"
   */
  role: RoleEnum;
  /**
   * Phương thức đăng nhập
   * @example "local"
   */
  provider: string;
  /**
   * Thời gian tạo
   * @format date-time
   * @example "2026-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * Thời gian cập nhật gần nhất
   * @format date-time
   * @example "2026-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface UpdateUserDto {
  /**
   * Email đăng nhập
   * @example "user@gmail.com"
   */
  email?: string;
  /**
   * Mật khẩu (ít nhất 8 ký tự, có chữ hoa, số)
   * @example "P@ssw0rd123"
   */
  password?: string;
  /**
   * Tên hiển thị
   * @example "Nguyễn Văn A"
   */
  name?: string;
  /**
   * Vai trò người dùng
   * @example "customer"
   */
  role?: RoleEnum;
  /**
   * Số điện thoại (VN)
   * @example "0987654321"
   */
  phone?: string;
  /**
   * URL ảnh đại diện
   * @example "https://avatar.com/user.png"
   */
  avatar?: string;
  /**
   * Phương thức đăng ký/đăng nhập (local, google, facebook)
   * @example "local"
   */
  provider?: string;
}

export interface UserFilterDto {
  /**
   * Trang hiện tại (mặc định 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Số lượng phần tử trên mỗi trang (mặc định 10)
   * @default 10
   * @example 10
   */
  limit?: number;
  /**
   * Sắp xếp theo trường (ví dụ: createdAt:DESC)
   * @example "createdAt:DESC"
   */
  orderby?: string;
  /** Điều kiện lọc bổ sung */
  filter?: object;
}

export interface CreateUserDto {
  /**
   * Email đăng nhập
   * @example "user@gmail.com"
   */
  email: string;
  /**
   * Mật khẩu (ít nhất 8 ký tự, có chữ hoa, số)
   * @example "P@ssw0rd123"
   */
  password: string;
  /**
   * Tên hiển thị
   * @example "Nguyễn Văn A"
   */
  name: string;
  /**
   * Vai trò người dùng
   * @example "customer"
   */
  role?: RoleEnum;
  /**
   * Số điện thoại (VN)
   * @example "0987654321"
   */
  phone?: string;
  /**
   * URL ảnh đại diện
   * @example "https://avatar.com/user.png"
   */
  avatar?: string;
  /**
   * Phương thức đăng ký/đăng nhập (local, google, facebook)
   * @example "local"
   */
  provider: string;
}

export interface LoginDto {
  /**
   * Email đăng nhập
   * @example "user@gmail.com"
   */
  email: string;
  /**
   * Mật khẩu (ít nhất 8 ký tự, có chữ hoa, số)
   * @example "P@ssw0rd123"
   */
  password: string;
}

export interface LoginResponseDto {
  /**
   * JWT Access Token dùng để xác thực các API
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
}

export interface ChangePasswordDto {
  /**
   * Mật khẩu cũ
   * @example "OldPassword123!"
   */
  oldPassword: string;
  /**
   * Mật khẩu mới
   * @example "NewPassword123!"
   */
  newPassword: string;
}

export interface CreateCategoryDto {
  /**
   * Tên danh mục
   * @example "Pizza"
   */
  name: string;
  /**
   * Slug của danh mục (tự sinh từ name nếu để trống)
   * @example "pizza"
   */
  slug?: string;
  /**
   * Mô tả danh mục
   * @example "Các loại pizza ngon nhất"
   */
  description?: string;
  /**
   * Thứ tự sắp xếp
   * @default 0
   * @example 1
   */
  sortOrder?: number;
  /**
   * Trạng thái hoạt động
   * @default 1
   * @example 1
   */
  isActive?: number;
}

export interface UpdateCategoryDto {
  /**
   * Tên danh mục
   * @example "Pizza"
   */
  name?: string;
  /**
   * Slug của danh mục (tự sinh từ name nếu để trống)
   * @example "pizza"
   */
  slug?: string;
  /**
   * Mô tả danh mục
   * @example "Các loại pizza ngon nhất"
   */
  description?: string;
  /**
   * Thứ tự sắp xếp
   * @default 0
   * @example 1
   */
  sortOrder?: number;
  /**
   * Trạng thái hoạt động
   * @default 1
   * @example 1
   */
  isActive?: number;
}

export interface ProductFilterDto {
  /**
   * Trang hiện tại
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Số lượng phần tử trên mỗi trang
   * @default 10
   * @example 10
   */
  limit?: number;
  /**
   * Trường dùng để sắp xếp
   * @example "sortOrder"
   */
  orderby?: string;
  /**
   * Hướng sắp xếp (ASC hoặc DESC)
   * @example "ASC"
   */
  orderDirection?: string;
  /**
   * Lọc theo ID danh mục
   * @example 1
   */
  categoryId?: number;
  /**
   * Lọc theo sản phẩm nổi bật (1: có, 0: không)
   * @example 1
   */
  isFeatured?: number;
}

export interface CreateProductVariantDto {
  /**
   * Tên biến thể
   * @example "Nhỏ - Mỏng"
   */
  name: string;
  /**
   * Kích thước
   * @example "12cm"
   */
  size: '12cm' | '15cm' | '17cm' | '1 Miếng' | '2 Miếng';
  /**
   * Loại đế/vỏ
   * @example "vừa"
   */
  type: 'nhỏ' | 'vừa' | 'lớn';
  /**
   * Giá chênh lệch so với giá gốc (VND)
   * @default 0
   * @example 5000
   */
  modifiedPrice?: number;
  /**
   * Thứ tự hiển thị
   * @default 0
   * @example 0
   */
  sortOrder?: number;
}

export interface CreateProductDto {
  /**
   * Tên sản phẩm
   * @example "Pizza Hải Sản"
   */
  name: string;
  /**
   * Mô tả chi tiết sản phẩm
   * @example "Pizza phủ hải sản tươi ngon"
   */
  description?: string;
  /**
   * Giá cơ bản (VND)
   * @example 180000
   */
  basePrice: number;
  /**
   * Thứ tự hiển thị
   * @default 0
   * @example 0
   */
  sortOrder?: number;
  /**
   * URL hình ảnh sản phẩm
   * @example "https://cdn.example.com/pizza.jpg"
   */
  img: string;
  /**
   * Sản phẩm nổi bật (1: có, 0: không)
   * @default 0
   * @example 1
   */
  isFeatured?: number;
  /**
   * ID danh mục
   * @example 1
   */
  categoryId: number;
  /** Danh sách biến thể kèm theo */
  variants?: CreateProductVariantDto[];
}

export interface ProductVariantResponseDto {
  /**
   * ID biến thể (auto-increment)
   * @example 1
   */
  id: number;
  /**
   * Tên biến thể
   * @example "Nhỏ - Mỏng"
   */
  name: string;
  /**
   * Kích thước
   * @example "12cm"
   */
  size: '12cm' | '15cm' | '17cm' | '1 Miếng' | '2 Miếng';
  /**
   * Loại đế/vỏ
   * @example "vừa"
   */
  type: 'nhỏ' | 'vừa' | 'lớn';
  /**
   * Giá chênh lệch so với giá gốc (VND)
   * @example 5000
   */
  modifiedPrice: number;
  /**
   * Thứ tự hiển thị
   * @example 0
   */
  sortOrder: number;
  /**
   * Trạng thái kích hoạt (1: hoạt động, 0: tắt)
   * @example 1
   */
  isActive: number;
}

export interface ProductIngredientResponseDto {
  /**
   * ID nguyên liệu
   * @example 1
   */
  id: number;
  /**
   * Tên nguyên liệu
   * @example "Phô mai Mozzarella"
   */
  name: string;
  /**
   * URL ảnh nguyên liệu
   * @example "https://cdn.example.com/cheese.jpg"
   */
  imageUrl: string;
  /**
   * Mô tả nguyên liệu
   * @example "Phô mai béo ngậy"
   */
  description: string;
  /**
   * Giá mua thêm nguyên liệu (VND)
   * @example 10000
   */
  price: number;
  /**
   * Bắt buộc phải có (1: có, 0: không)
   * @example 1
   */
  isRequired: number;
  /**
   * Trạng thái kích hoạt (1: hoạt động, 0: tắt)
   * @example 1
   */
  isActive: number;
  /**
   * ID danh mục
   * @example 2
   */
  categoryId: number;
}

export interface ProductDetailResponseDto {
  /**
   * ID sản phẩm (UUID)
   * @example "f47ac10b-58cc-4372-a567-0e02b2c3d479"
   */
  id: string;
  /**
   * Tên sản phẩm
   * @example "Pizza Hải Sản"
   */
  name: string;
  /**
   * Slug SEO-friendly
   * @example "pizza-hai-san"
   */
  slug: string;
  /**
   * Mô tả sản phẩm
   * @example "Pizza phủ hải sản tươi ngon"
   */
  description?: string;
  /**
   * Giá gốc (VND)
   * @example 180000
   */
  basePrice: number;
  /**
   * Thứ tự hiển thị
   * @example 0
   */
  sortOrder: number;
  /**
   * URL hình ảnh sản phẩm
   * @example "https://cdn.example.com/pizza.jpg"
   */
  img: string;
  /**
   * Sản phẩm nổi bật (1: có, 0: không)
   * @example 1
   */
  isFeatured: number;
  /**
   * ID danh mục
   * @example 2
   */
  categoryId: number;
  /**
   * Trạng thái kích hoạt (1: hoạt động, 0: tắt)
   * @example 1
   */
  isActive: number;
  /** Danh sách biến thể của sản phẩm */
  variants: ProductVariantResponseDto[];
  /** Danh sách nguyên liệu/topping thuộc danh mục sản phẩm */
  ingredients: ProductIngredientResponseDto[];
  /**
   * Thời điểm tạo
   * @format date-time
   */
  createdAt: string;
  /**
   * Thời điểm cập nhật lần cuối
   * @format date-time
   */
  updatedAt: string;
}

export type UpdateProductDto = object;

export interface CreateIngredientDto {
  /**
   * Tên nguyên liệu
   * @example "Double Cheese"
   */
  name: string;
  /**
   * Link ảnh nguyên liệu
   * @example "https://example.com/cheese.png"
   */
  imageUrl: string;
  /**
   * Mô tả nguyên liệu
   * @example "Thêm phô mai lát"
   */
  description?: string;
  /**
   * Thứ tự sắp xếp
   * @default 0
   * @example 1
   */
  sortOrder?: number;
  /**
   * Giá tiền nguyên liệu (VNĐ/đơn vị)
   * @example 15000
   */
  price: number;
  /**
   * Bắt buộc chọn không? (0: không, 1: có)
   * @default 0
   * @example 0
   */
  isRequired?: number;
  /**
   * Trạng thái hoạt động (0: ẩn, 1: hiện)
   * @default 1
   * @example 1
   */
  isActive?: number;
  /**
   * Mã ID danh mục chứa nguyên liệu này
   * @example 1
   */
  categoryId: number;
}

export interface UpdateIngredientDto {
  /**
   * Tên nguyên liệu
   * @example "Double Cheese"
   */
  name?: string;
  /**
   * Link ảnh nguyên liệu
   * @example "https://example.com/cheese.png"
   */
  imageUrl?: string;
  /**
   * Mô tả nguyên liệu
   * @example "Thêm phô mai lát"
   */
  description?: string;
  /**
   * Thứ tự sắp xếp
   * @default 0
   * @example 1
   */
  sortOrder?: number;
  /**
   * Giá tiền nguyên liệu (VNĐ/đơn vị)
   * @example 15000
   */
  price?: number;
  /**
   * Bắt buộc chọn không? (0: không, 1: có)
   * @default 0
   * @example 0
   */
  isRequired?: number;
  /**
   * Trạng thái hoạt động (0: ẩn, 1: hiện)
   * @default 1
   * @example 1
   */
  isActive?: number;
  /**
   * Mã ID danh mục chứa nguyên liệu này
   * @example 1
   */
  categoryId?: number;
}

export interface CreateAddressDto {
  /**
   * Tên đường, số nhà
   * @example "123 Đường Nguyễn Trãi"
   */
  street: string;
  /**
   * Thành phố / Tỉnh
   * @example "Hà Nội"
   */
  city: string;
  /**
   * Quận / Huyện
   * @example "Thanh Xuân"
   */
  district: string;
  /**
   * Phường / Xã
   * @example "Khương Trung"
   */
  ward?: string;
  /**
   * Đặt làm địa chỉ mặc định không? (0: không, 1: có)
   * @default 1
   * @example 1
   */
  isDefault?: number;
}

export interface UpdateAddressDto {
  /**
   * Tên đường, số nhà
   * @example "123 Đường Nguyễn Trãi"
   */
  street?: string;
  /**
   * Thành phố / Tỉnh
   * @example "Hà Nội"
   */
  city?: string;
  /**
   * Quận / Huyện
   * @example "Thanh Xuân"
   */
  district?: string;
  /**
   * Phường / Xã
   * @example "Khương Trung"
   */
  ward?: string;
  /**
   * Đặt làm địa chỉ mặc định không? (0: không, 1: có)
   * @default 1
   * @example 1
   */
  isDefault?: number;
}

export interface CreateCouponDto {
  /**
   * Mã coupon
   * @example "KM50K"
   */
  code: string;
  /**
   * Tên chương trình khuyến mãi
   * @example "Khuyến mãi giảm 50k"
   */
  name: string;
  /**
   * Mô tả chi tiết khuyến mãi
   * @example "Giảm 50k cho đơn hàng từ 200k"
   */
  description?: string;
  /**
   * Giá trị giảm giá
   * @example 50000
   */
  value: number;
  /**
   * Giá trị đơn hàng tối thiểu áp dụng (VNĐ)
   * @default 0
   * @example 200000
   */
  minOrderAmount?: number;
  /**
   * Số lượt sử dụng tối đa của coupon này
   * @default 1
   * @example 100
   */
  maxUser?: number;
  /**
   * Ngày bắt đầu áp dụng
   * @example "2026-07-01T00:00:00.000Z"
   */
  startDate: string;
  /**
   * Ngày hết hạn áp dụng
   * @example "2026-12-31T23:59:59.000Z"
   */
  endDate: string;
  /**
   * Trạng thái hoạt động (0: ẩn, 1: hoạt động)
   * @default 1
   * @example 1
   */
  isActive?: number;
}

export interface UpdateCouponDto {
  /**
   * Mã coupon
   * @example "KM50K"
   */
  code?: string;
  /**
   * Tên chương trình khuyến mãi
   * @example "Khuyến mãi giảm 50k"
   */
  name?: string;
  /**
   * Mô tả chi tiết khuyến mãi
   * @example "Giảm 50k cho đơn hàng từ 200k"
   */
  description?: string;
  /**
   * Giá trị giảm giá
   * @example 50000
   */
  value?: number;
  /**
   * Giá trị đơn hàng tối thiểu áp dụng (VNĐ)
   * @default 0
   * @example 200000
   */
  minOrderAmount?: number;
  /**
   * Số lượt sử dụng tối đa của coupon này
   * @default 1
   * @example 100
   */
  maxUser?: number;
  /**
   * Ngày bắt đầu áp dụng
   * @example "2026-07-01T00:00:00.000Z"
   */
  startDate?: string;
  /**
   * Ngày hết hạn áp dụng
   * @example "2026-12-31T23:59:59.000Z"
   */
  endDate?: string;
  /**
   * Trạng thái hoạt động (0: ẩn, 1: hoạt động)
   * @default 1
   * @example 1
   */
  isActive?: number;
}

export type CreateComboDto = object;

export type UserControllerGetAllData = UserResponseDto[];

export type UserControllerGetInfoData = UserResponseDto;

export type UserControllerGetByIdData = UserResponseDto;

export type UserControllerDeleteData = any;

export type UserControllerUpdateData = UserResponseDto;

export type UserControllerGetPageData = UserResponseDto[];

export type AuthControllerRegisterData = UserResponseDto;

export type AuthControllerLoginData = LoginResponseDto;

export type AuthControllerLogoutData = any;

export type AuthControllerRefreshData = LoginResponseDto;

export type AuthControllerChangePasswordData = any;

export type AuthControllerTestCustomerData = any;

export type AuthControllerTestAdminData = any;

export type CategoryControllerGetPageData = any;

export type CategoryControllerCreateData = any;

export type CategoryControllerGetBySlugData = any;

export type CategoryControllerGetByIdData = any;

export type CategoryControllerUpdateData = any;

export type CategoryControllerDeleteData = any;

export type ProductControllerGetPageData = any;

export type ProductControllerCreateData = any;

export type ProductControllerGetBySlugData = ProductDetailResponseDto;

export type ProductControllerGetByIdData = ProductDetailResponseDto;

export type ProductControllerUpdateData = any;

export type ProductControllerDeleteData = any;

export type IngredientControllerGetPageData = any;

export type IngredientControllerCreateData = any;

export type IngredientControllerGetByIdData = any;

export type IngredientControllerUpdateData = any;

export type IngredientControllerDeleteData = any;

export type AddressControllerGetPageData = any;

export type AddressControllerCreateData = any;

export type AddressControllerGetMyAddressesData = any;

export type AddressControllerUpdateData = any;

export type AddressControllerDeleteData = any;

export type CouponControllerGetPageData = any;

export type CouponControllerCreateData = any;

export type CouponControllerGetByIdData = any;

export type CouponControllerUpdateData = any;

export type CouponControllerDeleteData = any;

export type ReviewControllerGetPageData = any;

export type NotificationControllerGetNotificationsData = any;

export type NotificationControllerMarkAllAsReadData = any;

export type NotificationControllerMarkAsReadData = any;

export type NotificationControllerDeleteNotificationData = any;

export type ComboControllerCreateData = any;

export type ComboControllerFindAllData = any;

export type ComboControllerFindOneData = any;

export type ComboControllerRemoveData = any;

export type ComboControllerFindBySlugData = any;
