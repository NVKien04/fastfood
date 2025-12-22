export class ApiErrorResponseDto {
  message: string;
  errorCode: string | number;
  errors?: any;
  timestamp: string;
  path: string;
  takenTime: string;

  constructor(message: string, errorCode: string | number, errors?: any) {
    this.message = message;
    this.errorCode = errorCode;
    this.errors = errors;
    this.timestamp = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
    });
    this.path = '';
  }
}
