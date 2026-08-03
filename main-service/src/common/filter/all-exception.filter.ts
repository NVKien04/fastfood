import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponseDto } from '#src/common/dto/api-error-response.dto';
import { BusinessException } from '#src/common/exception/biz.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const startTime = request['reqTime'] ?? Date.now();
    const endTime = Date.now();
    const takenTime = `${endTime - startTime}ms`;

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode: string | number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Hệ thống đang có lỗi';
    let errors: string[] | null = null;

    if (exception instanceof BusinessException) {
      // Xử lý lỗi nghiệp vụ từ BusinessException
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse() as Record<string, any>;
      message = exceptionResponse.message;
      errorCode = exceptionResponse.errorCode;
    } else if (exception instanceof HttpException) {
      // Xử lý lỗi HttpException chuẩn NestJS (ValidationPipe, Guards, v.v.)
      httpStatus = exception.getStatus();
      errorCode = httpStatus;
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, any>;
        if (Array.isArray(res.message)) {
          message = 'Dữ liệu không hợp lệ';
          errors = res.message;
        } else {
          message = res.message || res.error || message;
        }
      }
    } else {
      // Lỗi không xác định (crash code, mất kết nối DB, v.v.)
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    const err = new ApiErrorResponseDto(message, errorCode, errors);
    err.takenTime = takenTime;
    err.path = request.url;

    response.status(httpStatus).json(err);
  }
}
