/**
 * DTO chuẩn cho mọi response lỗi.
 *
 * Format:
 *   { success: false, code: 'ERROR_CODE', message: 'Default english message' }
 *
 * Validation Error bổ sung field `errors`:
 *   { ..., errors: [{ field: 'name', messages: ['REQUIRED'] }] }
 */
export class ApiErrorResponseDto {
  success: boolean = false;
  code: string;
  message: string;
  errors?: ValidationFieldError[];
  timestamp?: string;
  path?: string;

  constructor(code: string, message: string, errors?: ValidationFieldError[]) {
    this.code = code;
    this.message = message;
    if (errors && errors.length > 0) {
      this.errors = errors;
    }
    this.timestamp = new Date().toISOString();
  }
}

export interface ValidationFieldError {
  field: string;
  messages: string[];
}
