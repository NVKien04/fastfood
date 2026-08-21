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

/** Thư mục lưu trữ trên S3 */
export enum StorageFolderEnum {
  Avatars = 'avatars',
  Products = 'products',
  Categories = 'categories',
  Combos = 'combos',
  Ingredients = 'ingredients',
  Banners = 'banners',
  Reviews = 'reviews',
  Uploads = 'uploads',
}

export interface UploadImageDto {
  /**
   * File ảnh cần upload (jpg, jpeg, png, webp, gif, svg)
   * @format binary
   */
  file: File;
  /**
   * Thư mục lưu trữ trên S3
   * @default "uploads"
   * @example "products"
   */
  folder?: StorageFolderEnum;
}

export interface UploadMultipleImagesDto {
  /** Danh sách các file ảnh */
  files: File[];
  /**
   * Thư mục lưu trữ trên S3
   * @default "uploads"
   * @example "products"
   */
  folder?: StorageFolderEnum;
}

export interface DeleteFileDto {
  /**
   * S3 Key (vd: avatars/17123.jpg) hoặc URL đầy đủ của file cần xóa
   * @example "avatars/1787325480204.png"
   */
  keyOrUrl: string;
}

export interface GetPresignedUrlDto {
  /**
   * Tên file gốc
   * @example "photo.png"
   */
  filename: string;
  /**
   * MIME type của file
   * @example "image/png"
   */
  mimetype: string;
  /**
   * Thư mục lưu trữ trên S3
   * @default "uploads"
   * @example "products"
   */
  folder?: StorageFolderEnum;
}

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
   * Từ khóa tìm kiếm theo tên hoặc mô tả
   * @example "Pizza"
   */
  search?: string;
  /**
   * Trường dùng để sắp xếp (sortOrder, basePrice, createdAt, name, isFeatured)
   * @example "sortOrder"
   */
  orderby?: string;
  /**
   * Alias của orderby
   * @example "sortOrder"
   */
  sortBy?: string;
  /**
   * Hướng sắp xếp (ASC hoặc DESC)
   * @example "ASC"
   */
  orderDirection?: 'ASC' | 'DESC';
  /**
   * Alias của orderDirection
   * @example "ASC"
   */
  sortOrder?: 'ASC' | 'DESC';
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
  /**
   * Lọc theo trạng thái hoạt động (1: đang bán, 0: ngưng bán)
   * @example 1
   */
  isActive?: number;
  /**
   * Lọc theo giá tối thiểu
   * @example 50000
   */
  minPrice?: number;
  /**
   * Lọc theo giá tối đa
   * @example 300000
   */
  maxPrice?: number;
}

export interface CreateProductVariantDto {
  /**
   * Tên biến thể
   * @example "Nhỏ - Mỏng"
   */
  name: string;
  /**
   * Kích thước
   * @example "20cm"
   */
  size: '20cm' | '25cm' | '30cm' | '35cm';
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
   * @example "20cm"
   */
  size: '20cm' | '25cm' | '30cm' | '35cm';
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

export interface UpdateProductStatusDto {
  /**
   * Trạng thái hoạt động (1: Đang bán, 0: Ngưng bán)
   * @example 1
   */
  isActive?: 0 | 1;
  /**
   * Sản phẩm nổi bật (1: Có, 0: Không)
   * @example 1
   */
  isFeatured?: 0 | 1;
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

export interface ApplyCouponDto {
  /**
   * Mã giảm giá cần áp dụng
   * @example "FASTFOOD20"
   */
  code: string;
  /**
   * Tổng tiền hàng trước khi áp dụng voucher (VND)
   * @example 120000
   */
  subTotal: number;
}

export interface CouponFilterDto {
  /**
   * Trang hiện tại (bắt đầu từ 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Số lượng mục trên mỗi trang
   * @default 10
   * @example 10
   */
  limit?: number;
  /**
   * Sắp xếp theo trường
   * @example "createdAt"
   */
  orderby?: string;
  /**
   * Lọc theo trạng thái kích hoạt (1: Đang hoạt động, 0: Tắt)
   * @example 1
   */
  isActive?: number;
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

export interface CreateOrderItemIngredientDto {
  /**
   * ID nguyên liệu / topping
   * @example 1
   */
  ingredientId: number;
  /**
   * Số lượng nguyên liệu
   * @default 1
   * @example 1
   */
  quantity?: number;
}

export interface CreateOrderItemDto {
  /**
   * ID sản phẩm (UUID)
   * @example "f47ac10b-58cc-4372-a567-0e02b2c3d479"
   */
  productId: string;
  /**
   * ID biến thể sản phẩm (size/loại đế)
   * @example 2
   */
  productVariantId?: number;
  /** Danh sách nguyên liệu / topping chọn thêm */
  ingredients?: CreateOrderItemIngredientDto[];
  /**
   * Số lượng mua
   * @default 1
   * @example 2
   */
  quantity: number;
}

export interface CreateOrderDto {
  /** Danh sách món ăn trong đơn */
  items: CreateOrderItemDto[];
  /**
   * ID địa chỉ giao hàng của User (nếu đã đăng nhập)
   * @example "uuid-address-id"
   */
  addressId?: string;
  /**
   * Họ tên khách hàng (nếu mua không cần tài khoản)
   * @example "Nguyen Van A"
   */
  guestName?: string;
  /**
   * Số điện thoại nhận hàng
   * @example "0901234567"
   */
  guestPhone?: string;
  /**
   * Địa chỉ giao hàng đầy đủ
   * @example "123 Đường ABC, Quận 1, TP.HCM"
   */
  guestAddress?: string;
  /**
   * Ghi chú cho nhà hàng / shipper
   * @example "Giao giờ hành chính, không cay"
   */
  notes?: string;
  /**
   * Mã giảm giá áp dụng cho đơn hàng
   * @example "FASTFOOD20"
   */
  couponCode?: string;
  /**
   * Phương thức thanh toán
   * @example "thanh toán khi giao hàng"
   */
  paymentMethod?: 'thanh toán khi giao hàng' | 'thanh toán online';
}

export interface OrderFilterDto {
  /**
   * Trang hiện tại
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Số lượng phần tử trên trang
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Lọc theo trạng thái đơn hàng */
  status?: 'đang chờ' | 'đã xác nhận' | 'đang chuẩn bị' | 'sẵn sàng' | 'đã giao hàng' | 'đã hủy';
  /**
   * Lọc theo ID người dùng
   * @example "uuid-user-id"
   */
  userId?: string;
}

export interface CancelOrderDto {
  /**
   * Lý do hủy đơn hàng
   * @example "Tôi đổi ý, không muốn đặt nữa"
   */
  reason?: string;
}

export type CreateComboDto = object;

export interface SimulateDeliveryDto {
  /**
   * Thời gian chờ giữa mỗi bước chuyển trạng thái (giây)
   * @min 1
   * @max 60
   * @default 5
   * @example 5
   */
  stepDelaySeconds?: number;
}

export type UploadControllerUploadImageData = any;

export type UploadControllerUploadMultipleImagesData = any;

export type UploadControllerDeleteFileData = any;

export type UploadControllerGetPresignedUrlData = any;

export type UserControllerGetAllData = UserResponseDto[];

export type UserControllerGetInfoData = UserResponseDto;

export type UserControllerGetByIdData = UserResponseDto;

export type UserControllerDeleteData = any;

export type UserControllerUpdateData = UserResponseDto;

export type UserControllerAddAddressData = any;

export type UserControllerGetPageData = UserResponseDto[];

export type AddressControllerGetPageData = any;

export type AddressControllerCreateData = any;

export type AddressControllerGetMyAddressesData = any;

export type AddressControllerUpdateData = any;

export type AddressControllerDeleteData = any;

export type AuthControllerRegisterData = UserResponseDto;

export type AuthControllerGoogleAuthData = any;

export type AuthControllerGoogleAuthCallbackData = any;

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

export type ProductControllerGetRelatedData = any;

export type ProductControllerGetByIdData = ProductDetailResponseDto;

export type ProductControllerUpdateData = any;

export type ProductControllerDeleteData = any;

export type ProductControllerUpdateStatusData = any;

export type IngredientControllerGetPageData = any;

export type IngredientControllerCreateData = any;

export type IngredientControllerGetByIdData = any;

export type IngredientControllerUpdateData = any;

export type IngredientControllerDeleteData = any;

export type CouponControllerApplyCouponData = any;

export type CouponControllerGetPageData = any;

export type CouponControllerCreateData = any;

export type CouponControllerGetByIdData = any;

export type CouponControllerUpdateData = any;

export type CouponControllerDeleteData = any;

export type OrderControllerCreateOrderData = any;

export type OrderControllerGetMyOrdersData = any;

export type OrderControllerGetOrdersPageData = any;

export type OrderControllerGetOrderByIdData = any;

export type OrderControllerCancelOrderData = any;

export type OrderControllerUpdateStatusData = any;

export type NotificationControllerGetNotificationsData = any;

export type NotificationControllerMarkAllAsReadData = any;

export type NotificationControllerMarkAsReadData = any;

export type NotificationControllerDeleteNotificationData = any;

export type ComboControllerCreateData = any;

export type ComboControllerFindAllData = any;

export type ComboControllerFindOneData = any;

export type ComboControllerRemoveData = any;

export type ComboControllerFindBySlugData = any;

export type DeliverySimulationControllerSimulateDeliveryData = any;
