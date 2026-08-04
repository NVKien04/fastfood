import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MAP, ErrorEnum } from '#src/common/constants/error-code.constant';

/**
 * BusinessException - Exception lỗi nghiệp vụ tập trung (hỗ trợ i18n).
 *
 * Cách sử dụng:
 *   throw new BusinessException(ErrorEnum.CATEGORY_EXISTED);
 *
 * Response body sẽ chứa:
 *   { code: 'CATEGORY_EXISTED', message: 'Category already exists' }
 *
 * FE dùng field `code` để tra cứu file i18n, `message` chỉ là fallback.
 */
export class BusinessException extends HttpException {
  constructor(error: ErrorEnum) {
    const detail = ERROR_MAP[error];

    super(
      {
        code: error,
        message: detail?.message ?? 'Internal server error',
      },
      detail?.httpStatus ?? HttpStatus.OK,
    );
  }
}

export { BusinessException as BizException };
