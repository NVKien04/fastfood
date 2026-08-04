import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponseDto, ValidationFieldError } from '#src/common/dto/api-error-response.dto';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ErrorEnum.INTERNAL_ERROR;
    let message = 'Internal server error';
    let validationErrors: ValidationFieldError[] | undefined;

    if (exception instanceof BusinessException) {
      // Lỗi nghiệp vụ từ BusinessException
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse() as Record<string, any>;
      code = exceptionResponse.code;
      message = exceptionResponse.message;
    } else if (exception instanceof HttpException) {
      // Lỗi HttpException chuẩn NestJS (ValidationPipe, Guards, v.v.)
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        code = this.httpStatusToCode(httpStatus);
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, any>;

        if (Array.isArray(res.message)) {
          // ValidationPipe trả về mảng lỗi → chuyển thành format chuẩn
          code = ErrorEnum.VALIDATION_ERROR;
          message = 'Validation failed';
          validationErrors = this.formatValidationErrors(res.message);
        } else {
          code = this.httpStatusToCode(httpStatus);
          message = res.message || res.error || message;
        }
      }
    } else {
      // Lỗi không xác định (crash code, mất kết nối DB, v.v.)
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    const errorResponse = new ApiErrorResponseDto(code, message, validationErrors);
    errorResponse.path = request.url;

    response.status(httpStatus).json(errorResponse);
  }

  /**
   * Map HTTP status code sang error code string.
   */
  private httpStatusToCode(status: HttpStatus | number): string {
    const statusCode = status as HttpStatus;
    switch (statusCode) {
      case HttpStatus.UNAUTHORIZED:
        return ErrorEnum.INVALID_TOKEN;
      case HttpStatus.FORBIDDEN:
        return ErrorEnum.NO_PERMISSION;
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.BAD_REQUEST:
        return ErrorEnum.VALIDATION_ERROR;
      default:
        return ErrorEnum.INTERNAL_ERROR;
    }
  }

  /**
   * Chuyển đổi mảng lỗi từ ValidationPipe sang format chuẩn:
   * [{ field: 'name', messages: ['REQUIRED', 'MIN_LENGTH'] }]
   *
   * ValidationPipe thường trả về mảng string dạng:
   *   ["name must be longer than or equal to 3 characters", "email must be an email"]
   *
   * Hàm này nhóm theo field name (word đầu tiên).
   */
  private formatValidationErrors(messages: string[]): ValidationFieldError[] {
    const fieldMap = new Map<string, string[]>();

    for (const msg of messages) {
      // Lấy field name từ đầu message (ví dụ: "name must be..." → field = "name")
      const field = msg.split(' ')[0] || 'unknown';
      if (!fieldMap.has(field)) {
        fieldMap.set(field, []);
      }
      fieldMap.get(field)!.push(msg);
    }

    return Array.from(fieldMap.entries()).map(([field, msgs]) => ({
      field,
      messages: msgs,
    }));
  }
}
