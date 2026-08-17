# Project Rules

## TypeScript & Imports
- **Không sử dụng `any`** trong toàn bộ dự án. Sử dụng `unknown`, generic type, hoặc type cụ thể thay thế.
- **Sử dụng `type-only import`**: Luôn dùng `import { type MyType }` hoặc `import type { MyType }` khi chỉ import type/interface.
- **Luôn sử dụng đường dẫn tuyệt đối (Absolute Imports)**: Mọi câu lệnh `import` bắt buộc dùng alias `@/...` (ví dụ: `@/modules/order/presentation/dto`, `@/enums`, `@/entities`, `@/common/...`). Tuyệt đối **không sử dụng đường dẫn tương đối** (`./`, `../`, `../../`).
- **Tổ chức Barrel Export (`index.ts`)**:
  - Mọi thư mục có **từ 2 file `.ts` trở lên** (ví dụ: `dto/`, `services/`, `entities/`, `enums/`, `decorators/`, `guards/`, `constants/`, v.v.) bắt buộc phải có file `index.ts` để re-export tất cả file con (`export * from './...';`).
  - Các nơi khác khi import từ thư mục đó **bắt buộc import qua barrel file / thư mục**, không import trực tiếp từng file riêng lẻ (ví dụ: `import { CreateOrderDto, OrderFilterDto } from '@/modules/order/presentation/dto';`).
  - Thư mục chỉ có 1 file đơn lẻ thì không bắt buộc tạo `index.ts`.

## Cấu trúc Types & Interfaces (Clean Architecture / DDD)
- **Không đặt `type` hoặc `interface` vào thư mục `constants/`**. Thư mục `constants/` chỉ chứa các giá trị hằng số runtime (ví dụ: `REDIS_KEYS`, `REDIS_TTL`, config constants).
- **Module Types/Interfaces (Domain contracts)**: Đặt trong `src/modules/<module>/domain/interface/` hoặc `domain/repositories/` (ví dụ: `IProductRepository`, `ICacheService`, `IStorageService`, `AuthUser`, `JwtPayload`).
- **API Request/Response Types**: Đặt trong `src/modules/<module>/presentation/dto/` (ví dụ: `CreateProductDto`, `ProductDetailResponseDto`).
- **Global Shared Types**: Đặt trong `src/common/types/` (ví dụ: `PaginationOptions`, `PaginationResponse<T>`, `ApiResponse<T>`).
- **Enums**: Đặt trong `src/enums/` hoặc `src/common/enums/`.
