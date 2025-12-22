export class ApiResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T | null;
  timestamp: string;
  path: string;
  takenTime: string;

  constructor(success: boolean, message: string, data?: T | null) {
    this.success = success;
    this.message = message;
    this.data = data || null;
    this.timestamp = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
    });
    this.path = '';
    this.takenTime = '';
  }
}
