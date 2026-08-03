import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

/**
 * BusinessException - Exception lỗi nghiệp vụ tập trung.
 * Hỗ trợ 2 cách throw:
 *
 * 1. Truyền ErrorEnum (tự tách 3 thành phần CODE:MESSAGE:HTTP_STATUS):
 *    throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
 *
 * 2. Truyền chuỗi custom message (mặc định HTTP 400):
 *    throw new BusinessException('Tài khoản đã bị khóa');
 */
export class BusinessException extends HttpException {
  constructor(error: ErrorEnum) {
    if (!error.includes(':')) {
      // Trường hợp truyền chuỗi custom message
      super(
        {
          message: error,
          errorCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
      return;
    }

    // Trường hợp truyền ErrorEnum → tách 3 thành phần
    const [code, message, httpStatus] = error.split(':');
    const status = Number(httpStatus) || HttpStatus.BAD_REQUEST;

    super(
      {
        message: message,
        errorCode: Number(code),
      },
      status,
    );
  }
}

export { BusinessException as BizException };
