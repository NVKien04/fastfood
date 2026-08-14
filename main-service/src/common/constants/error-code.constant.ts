import { HttpStatus } from '@nestjs/common';

/**
 * Mã lỗi nghiệp vụ tập trung cho toàn dự án (Hỗ trợ i18n).
 *
 * - Mỗi key là một string code duy nhất (ví dụ: 'CATEGORY_EXISTED').
 * - FE dùng field `code` trong response để tra cứu file i18n (vi.json, en.json...).
 * - Message mặc định bằng tiếng Anh, chỉ đóng vai trò fallback.
 */
export enum ErrorEnum {
  // ========== Auth & User ==========
  USER_EXISTED = 'USER_EXISTED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_USERNAME_PASSWORD = 'INVALID_USERNAME_PASSWORD',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // ========== Authorization ==========
  NO_PERMISSION = 'NO_PERMISSION',

  // ========== Product & Category ==========
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_SLUG_EXISTED = 'PRODUCT_SLUG_EXISTED',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  CATEGORY_EXISTED = 'CATEGORY_EXISTED',
  INGREDIENT_NOT_FOUND = 'INGREDIENT_NOT_FOUND',

  // ========== Cart & Order ==========
  CART_EMPTY = 'CART_EMPTY',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',

  // ========== Coupon ==========
  COUPON_NOT_FOUND = 'COUPON_NOT_FOUND',
  COUPON_EXPIRED = 'COUPON_EXPIRED',
  COUPON_OUT_OF_USES = 'COUPON_OUT_OF_USES',
  COUPON_MIN_AMOUNT_NOT_REACHED = 'COUPON_MIN_AMOUNT_NOT_REACHED',
  COUPON_NOT_STARTED = 'COUPON_NOT_STARTED',

  // ========== Address ==========
  ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND',

  // ========== Combo ==========
  COMBO_NOT_FOUND = 'COMBO_NOT_FOUND',

  // ========== File & Storage ==========
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',

  // ========== General ==========
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export interface ErrorDetail {
  httpStatus: number;
  message: string;
}

/**
 * Bảng tra cứu chi tiết cho từng ErrorEnum.
 * - httpStatus: HTTP Status Code tương ứng.
 * - message: Message mặc định bằng tiếng Anh (fallback cho FE).
 */
export const ERROR_MAP: Record<ErrorEnum, ErrorDetail> = {
  // Auth & User
  [ErrorEnum.USER_EXISTED]: { httpStatus: HttpStatus.CONFLICT, message: 'Email already exists' },
  [ErrorEnum.USER_NOT_FOUND]: { httpStatus: HttpStatus.NOT_FOUND, message: 'User not found' },
  [ErrorEnum.INVALID_USERNAME_PASSWORD]: { httpStatus: HttpStatus.UNAUTHORIZED, message: 'Invalid email or password' },
  [ErrorEnum.INVALID_TOKEN]: { httpStatus: HttpStatus.UNAUTHORIZED, message: 'Invalid token' },
  [ErrorEnum.TOKEN_EXPIRED]: { httpStatus: HttpStatus.UNAUTHORIZED, message: 'Token expired' },

  // Authorization
  [ErrorEnum.NO_PERMISSION]: { httpStatus: HttpStatus.FORBIDDEN, message: 'Permission denied' },

  // Product & Category
  [ErrorEnum.PRODUCT_NOT_FOUND]: { httpStatus: HttpStatus.NOT_FOUND, message: 'Product not found' },
  [ErrorEnum.PRODUCT_SLUG_EXISTED]: {
    httpStatus: HttpStatus.CONFLICT,
    message: 'Product with this slug already exists',
  },
  [ErrorEnum.CATEGORY_NOT_FOUND]: { httpStatus: HttpStatus.NOT_FOUND, message: 'Category not found' },
  [ErrorEnum.CATEGORY_EXISTED]: { httpStatus: HttpStatus.CONFLICT, message: 'Category already exists' },
  [ErrorEnum.INGREDIENT_NOT_FOUND]: { httpStatus: HttpStatus.NOT_FOUND, message: 'Ingredient not found' },

  // Cart & Order
  [ErrorEnum.CART_EMPTY]: { httpStatus: HttpStatus.BAD_REQUEST, message: 'Cart is empty' },
  [ErrorEnum.ORDER_NOT_FOUND]: { httpStatus: HttpStatus.NOT_FOUND, message: 'Order not found' },

  // Coupon
  [ErrorEnum.COUPON_NOT_FOUND]: { httpStatus: HttpStatus.NOT_FOUND, message: 'Coupon not found' },
  [ErrorEnum.COUPON_EXPIRED]: { httpStatus: HttpStatus.BAD_REQUEST, message: 'Coupon has expired' },
  [ErrorEnum.COUPON_OUT_OF_USES]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: 'Coupon usage limit has been reached',
  },
  [ErrorEnum.COUPON_MIN_AMOUNT_NOT_REACHED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: 'Order amount does not meet the minimum requirement for this coupon',
  },
  [ErrorEnum.COUPON_NOT_STARTED]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: 'Coupon is not yet active',
  },

  // Address
  [ErrorEnum.ADDRESS_NOT_FOUND]: { httpStatus: HttpStatus.NOT_FOUND, message: 'Address not found' },

  // Combo
  [ErrorEnum.COMBO_NOT_FOUND]: { httpStatus: HttpStatus.NOT_FOUND, message: 'Combo not found' },

  // File & Storage
  [ErrorEnum.FILE_UPLOAD_FAILED]: { httpStatus: HttpStatus.BAD_REQUEST, message: 'Failed to upload file' },
  [ErrorEnum.INVALID_FILE_TYPE]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: 'Invalid file type. Allowed types: jpg, png, webp, gif, svg',
  },
  [ErrorEnum.FILE_TOO_LARGE]: {
    httpStatus: HttpStatus.BAD_REQUEST,
    message: 'File size exceeds maximum allowed limit',
  },

  // General
  [ErrorEnum.VALIDATION_ERROR]: { httpStatus: HttpStatus.BAD_REQUEST, message: 'Validation failed' },
  [ErrorEnum.INTERNAL_ERROR]: { httpStatus: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' },
};
