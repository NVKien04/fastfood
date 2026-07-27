import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '#src/common/dto/api-response.dto';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseDto<T>> {
    const request = context.switchToHttp().getRequest();
    const startTime = request['reqTime'] ?? Date.now();

    return next.handle().pipe(
      map((result: any) => {
        const endTime = Date.now();
        const takenTime = `${endTime - startTime}ms`;

        // console.log('Response result:', result);

        // Nếu đã là ApiResponseDto
        if (result && typeof result === 'object' && 'success' in result && 'timestamp' in result) {
          result.path = request.url;
          result.takenTime = takenTime;
          return result;
        }

        let autoMessage = 'Lấy dữ liệu thành công';
        switch (request.method) {
          case 'POST':
            autoMessage = 'Tạo mới thành công';
            break;
          case 'PUT':
          case 'PATCH':
            autoMessage = 'Cập nhật thành công';
            break;
          case 'DELETE':
            autoMessage = 'Xóa thành công';
            break;
        }

        const message = result && typeof result === 'object' && 'message' in result ? result.message : autoMessage;

        const data = result && typeof result === 'object' && 'data' in result ? result.data : result;

        const meta = result && typeof result === 'object' && 'meta' in result ? result.meta : undefined;

        const response = new ApiResponseDto<T>(true, message, data, meta);
        response.path = request.url;
        response.takenTime = takenTime;

        return response;
      }),
    );
  }
}
