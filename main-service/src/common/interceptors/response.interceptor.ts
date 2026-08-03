import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '#src/common/dto/api-response.dto';
import { BYPASS_KEY } from '#src/common/decorators/bypass.decorator';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  constructor(private readonly reflector: Reflector) {}

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T> | any> {
    // Kiểm tra @Bypass() decorator → bỏ qua auto-wrap
    const isBypassed = this.reflector.get<boolean>(BYPASS_KEY, context.getHandler());
    if (isBypassed) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const startTime = request['reqTime'] ?? Date.now();

    return next.handle().pipe(
      map((result: any) => {
        const endTime = Date.now();
        const takenTime = `${endTime - startTime}ms`;

        // Nếu đã là ApiResponseDto
        if (result && typeof result === 'object' && 'code' in result && 'timestamp' in result) {
          result.path = request.url;
          result.takenTime = takenTime;
          return result;
        }

        const message = 'success';

        const data = result && typeof result === 'object' && 'data' in result ? result.data : result;

        const meta = result && typeof result === 'object' && 'meta' in result ? result.meta : undefined;

        const response = new ApiResponseDto<T>(200, message, data, meta);
        response.path = request.url;
        response.takenTime = takenTime;

        return response;
      }),
    );
  }
}
