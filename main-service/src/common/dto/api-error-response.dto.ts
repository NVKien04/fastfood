import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidationFieldErrorDto {
  @ApiProperty({ example: 'email', description: 'Tên trường bị lỗi' })
  field: string;

  @ApiProperty({ example: ['REQUIRED', 'INVALID_EMAIL'], description: 'Danh sách các thông báo lỗi' })
  messages: string[];
}

export type ValidationFieldError = ValidationFieldErrorDto;

export class ApiErrorResponseDto {
  @ApiProperty({ example: false, description: 'Trạng thái (luôn là false cho error)' })
  success: boolean = false;

  @ApiProperty({ example: 'USER_NOT_FOUND', description: 'Mã lỗi nghiệp vụ' })
  code: string;

  @ApiProperty({ example: 'Không tìm thấy người dùng', description: 'Thông báo lỗi chi tiết' })
  message: string;

  @ApiPropertyOptional({ type: [ValidationFieldErrorDto], description: 'Chi tiết các trường vi phạm validation' })
  errors?: ValidationFieldErrorDto[];

  @ApiPropertyOptional({ example: '2026-08-09T00:00:00.000Z', description: 'Thời gian xảy ra lỗi' })
  timestamp?: string;

  @ApiPropertyOptional({ example: '/api/users/123', description: 'Đường dẫn request' })
  path?: string;

  constructor(code: string, message: string, errors?: ValidationFieldErrorDto[]) {
    this.code = code;
    this.message = message;
    if (errors && errors.length > 0) {
      this.errors = errors;
    }
    this.timestamp = new Date().toISOString();
  }
}
