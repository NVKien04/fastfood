import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponseDto } from 'src/dtos/common/api-error-response.dto';

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

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Hệ thống đang có lỗi';
    let error: string[] | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, any>;
        if (Array.isArray(res.message)) {
          message = 'Dữ liệu không hợp lệ';
          error = res.message;
        } else {
          message = res.message || res.error || message;
        }
      }
    } else {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }
    const err = new ApiErrorResponseDto(message, status, error);
    err.takenTime = takenTime;
    err.path = request.url;

    response.status(status).json(err);
  }
}
