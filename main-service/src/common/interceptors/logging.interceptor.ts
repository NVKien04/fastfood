import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = request['reqTime'] ?? Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = response;
        const takenTime = `${Date.now() - startTime}ms`;
        this.logger.log(`[${method}] ${originalUrl} ${statusCode} - ${takenTime} - IP: ${ip} - ${userAgent}`);
      }),
    );
  }
}
