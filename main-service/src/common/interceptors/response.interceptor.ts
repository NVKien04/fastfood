import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto, type PaginationMetaDto } from '@/common/dto';
import { BYPASS_KEY } from '@/common/decorators';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T> | unknown> {
    // Kiểm tra @Bypass() decorator → bỏ qua auto-wrap
    const isBypassed = this.reflector.get<boolean>(BYPASS_KEY, context.getHandler());
    if (isBypassed) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const startTime = request['reqTime'] ?? Date.now();

    return next.handle().pipe(
      map((result: unknown) => {
        const endTime = Date.now();
        const takenTime = `${endTime - startTime}ms`;

        // Nếu đã là ApiResponseDto (đã wrap sẵn)
        if (result && typeof result === 'object' && 'success' in result) {
          return {
            ...result,
            path: request.url,
            takenTime,
          };
        }

        const data = result && typeof result === 'object' && 'data' in result ? result.data : result;
        const meta =
          result && typeof result === 'object' && 'meta' in result && this.isPaginationMeta(result.meta)
            ? result.meta
            : undefined;

        const response = new ApiResponseDto<T>(data as T, meta);
        response.path = request.url;
        response.takenTime = takenTime;

        return response;
      }),
    );
  }

  private isPaginationMeta(value: unknown): value is PaginationMetaDto {
    return (
      value !== null &&
      typeof value === 'object' &&
      'totalItems' in value &&
      'itemCount' in value &&
      'itemsPerPage' in value &&
      'totalPages' in value &&
      'currentPage' in value
    );
  }
}
