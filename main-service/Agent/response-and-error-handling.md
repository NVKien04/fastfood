# Hướng dẫn Xử lý Response, Error Handling và Logging trong dự án FastFood (main-service)

Tài liệu này hướng dẫn chi tiết về cấu trúc, cơ chế tự động hóa và cách sử dụng các thành phần liên quan đến **Response**, **Error Handling** và **Logging** trong dự án `fastfood / main-service`.

---

## 📋 1. Tổng quan kiến trúc

Dự án áp dụng cơ chế chuẩn hóa phản hồi, xử lý lỗi tập trung và ghi log dựa trên các tính năng cốt lõi của NestJS:

```
                  ┌──────────────────────────────┐
                  │      Controller / Service    │
                  └──────────────┬───────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        [Trả về dữ liệu]                 [Throw Exception]
                 │                               │
                 ▼                               ▼
     ┌───────────────────────┐       ┌───────────────────────┐
     │ ApiResponseInterceptor│       │  AllExceptionFilter   │
     └───────────┬───────────┘       └───────────┬───────────┘
                 │                               │
                 ▼                               ▼
     ┌───────────────────────┐       ┌───────────────────────┐
     │ Bọc ApiResponseDto    │       │ Format ApiErrorRespDto│
     │ { code, msg, data }   │       │ { msg, errorCode ... }│
     └───────────┬───────────┘       └───────────┬───────────┘
                 │                               │
                 └───────────────┬───────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   LoggingInterceptor    │ (Ghi Log HTTP request/response)
                    └────────────┬────────────┘
                                 ▼
                         [HTTP Client]
```

---

## 🎯 2. Cấu trúc Response Chuẩn (`ApiResponseDto`)

Dữ liệu trả về cho Client luôn được chuẩn hóa theo lớp [`ApiResponseDto<T>`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/dto/api-response.dto.ts):

```json
{
  "code": 200,
  "message": "Lấy dữ liệu thành công",
  "data": { ... },
  "meta": { "totalItems": 10, "currentPage": 1, ... }, // Có nếu là API phân trang
  "timestamp": "02/08/2026, 22:45:10",
  "path": "/api/products",
  "takenTime": "12ms"
}
```

### Chi tiết thuộc tính:

- `code` (`number`): Mã trạng thái phản hồi HTTP/nghiệp vụ. Mặc định thành công là `200`.
- `message` (`string`): Thông báo phản hồi. Mặc định tự sinh theo HTTP method (ví dụ: `'Lấy dữ liệu thành công'`).
- `data` (`T`): Dữ liệu thực tế trả về từ Controller/Service.
- `meta` (`PaginationMeta`): Metadata chỉ có trong response phân trang, chứa thông tin về phân trang.
- `timestamp` (`string`): Thời gian request.
- `path` (`string`): Đường dẫn API request.
- `takenTime` (`string`): Thời gian xử lý request (tính từ Middleware).

---

## ⚡ 3. Tự động hóa Response với `ApiResponseInterceptor`

Lớp [`ApiResponseInterceptor`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/interceptors/response.interceptor.ts) được đăng ký làm `APP_INTERCEPTOR` toàn cục trong [`app.module.ts`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/app.module.ts).

### Cách hoạt động:

Khi một Controller method kết thúc thành công:

1. Interceptor tự động bọc giá trị trả về (`data`) thành `new ApiResponseDto(200, message, data, meta)`.
2. Lập trình viên **không cần** tự bọc `new ApiResponseDto(...)` ở từng Controller.

### Ví dụ lập trình Controller:

```typescript
@Get(':id')
async findOne(@Param('id') id: string) {
  // Chỉ cần trả về dữ liệu thuần túy (entity / DTO / object)
  return await this.userService.getById(id);
}
```

**Kết quả Client nhận được:**

```json
{
  "code": 200,
  "message": "Lấy dữ liệu thành công",
  "data": {
    "id": "uuid-v4",
    "name": "Nguyen Van A",
    "email": "user@gmail.com"
  },
  "timestamp": "02/08/2026, 22:45:10",
  "path": "/api/user/uuid-v4",
  "takenTime": "15ms"
}
```

---

## 🚫 4. Bỏ qua định dạng chuẩn với `@Bypass()`

Trong trường hợp cần trả về dữ liệu thô (ví dụ: stream file, xuất Excel, render HTML, SSE, v.v.):

Sử dụng Decorator [`@Bypass()`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/decorators/bypass.decorator.ts):

```typescript
import { Bypass } from '#src/common/decorators/bypass.decorator';

@Controller('export')
export class ExportController {
  @Get('excel')
  @Bypass() // Tắt tính năng tự động bọc ApiResponseDto
  async exportExcel(@Res() res: Response) {
    const buffer = await this.exportService.generateExcel();
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  }
}
```

---

## 🚨 5. Xử lý Lỗi và Exception Handling

### 5.1 Định nghĩa mã lỗi (`ErrorEnum`)

Tất cả mã lỗi nghiệp vụ của dự án được tập trung tại [`ErrorEnum`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/constants/error-code.constant.ts) theo định dạng 3 thành phần `'CODE:MESSAGE:HTTP_STATUS'`:

```typescript
export enum ErrorEnum {
  USER_NOT_FOUND = '1017:Người dùng không tồn tại:404',
  INVALID_USERNAME_PASSWORD = '1003:Tài khoản hoặc mật khẩu không đúng:400',
  NO_PERMISSION = '1102:Không có quyền truy cập:403',
}
```

Chi tiết 3 thành phần trong chuỗi:

1. `CODE` (`number`): Mã lỗi nghiệp vụ nội bộ (ví dụ: `1017`, `1003`, `1102`).
2. `MESSAGE` (`string`): Thông báo lỗi hiển thị cho người dùng.
3. `HTTP_STATUS` (`number`): Mã HTTP Status Code tương ứng (ví dụ: `404` NOT_FOUND, `400` BAD_REQUEST, `403` FORBIDDEN).

---

### 5.2 Ném lỗi Nghiệp vụ với `BusinessException` (`BizException`)

Khi xảy ra lỗi logic nghiệp vụ trong Service/Controller, sử dụng class [`BusinessException`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/exception/biz.exception.ts). Lớp này tự động tách 3 thành phần từ `ErrorEnum` (`code`, `message`, `httpStatus`):

```typescript
import { BusinessException } from '#src/common/exception/biz.exception';
// Hoặc import bí danh: import { BizException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

// Throw lỗi dựa trên enum 3 thành phần định sẵn
throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

// Hoặc throw lỗi custom message (mặc định HTTP Status 400)
throw new BusinessException('Tài khoản đã bị khóa');
```

---

### 5.3 Filter bắt lỗi toàn cục (`AllExceptionFilter`)

Lớp [`AllExceptionFilter`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/filter/all-exception.filter.ts) đảm nhận việc bắt mọi Exception chưa được xử lý trong ứng dụng:

1. Trích xuất Mã lỗi (`errorCode`), Thông báo (`message`) và HTTP Status Code (`httpStatus`).
2. Format lỗi trả về cho Client theo [`ApiErrorResponseDto`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/dto/api-error-response.dto.ts):
   ```json
   {
     "message": "Người dùng không tồn tại",
     "errorCode": 1017,
     "errors": null,
     "timestamp": "02/08/2026, 22:45:10",
     "path": "/api/user/1017",
     "takenTime": "8ms"
   }
   ```
3. Giấu thông tin chi tiết của lỗi `500 Internal Server Error` khi ứng dụng chạy ở môi trường Production (`isDev = false`) để bảo đảm an toàn thông tin.

---

## 📝 6. Ghi Log HTTP Request/Response (`LoggingInterceptor`)

Lớp [`LoggingInterceptor`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/interceptors/logging.interceptor.ts) đảm nhận việc ghi log tự động cho mọi HTTP Request/Response trên Server.

### Code mẫu `LoggingInterceptor`:

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
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
```

### Đăng ký toàn cục trong `app.module.ts`:

```typescript
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
];
```

---

## 🛠️ 7. Các Interceptor & Middleware bổ trợ khác

Dự án còn tích hợp thêm các Interceptor/Middleware sau trong luồng xử lý Request/Response:

1. **[`StartTimingMiddleware`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/common/middleware/start-timing.middleware.ts):** Gắn mốc thời gian `req['reqTime']` đầu tiên khi request tới server.
2. **[`ClassSerializerInterceptor`](file:///Users/nguyenvankien/Documents/WorkSpace/fastfood/fastfood/main-service/src/main.ts):** Tự động loại bỏ các thuộc tính đánh dấu `@Exclude()` (như `password`) khỏi Response.

---

## 📌 Summary Cheatsheet cho Developer

| Nhu cầu                                   | Giải pháp / Code ví dụ                                 |
| :---------------------------------------- | :----------------------------------------------------- |
| **Trả về dữ liệu thành công**             | `return data;` _(Interceptor tự bọc `ApiResponseDto`)_ |
| **Bỏ bọc `ApiResponseDto` (Stream/File)** | Gắn `@Bypass()` lên Controller method                  |
| **Throw lỗi nghiệp vụ**                   | `throw new BusinessException(ErrorEnum.XYZ)`           |
| **Ẩn trường nhạy cảm trong Response**     | Đánh dấu `@Exclude()` trong Entity/DTO                 |
| **Ghi Log HTTP Request/Response**         | Đăng ký `LoggingInterceptor` làm `APP_INTERCEPTOR`     |
