# Project Rules

## TypeScript
- **Không sử dụng `any`** trong toàn bộ dự án. Sử dụng `unknown`, generic type, hoặc type cụ thể thay thế.
- **Sử dụng `type-only import`**: Luôn dùng `import { type MyType }` hoặc `import type { MyType }` khi chỉ import type/interface.

## Cấu trúc Types & Interfaces (Clean Architecture / DDD)
- **Không đặt `type` hoặc `interface` vào thư mục `constants/`**. Thư mục `constants/` chỉ chứa các giá trị hằng số runtime (ví dụ: `REDIS_KEYS`, `REDIS_TTL`, config constants).
- **Module Types/Interfaces (Domain contracts)**: Đặt trong `src/modules/<module>/domain/interface/` hoặc `domain/repositories/` (ví dụ: `IProductRepository`, `ICacheService`, `IStorageService`, `AuthUser`, `JwtPayload`).
- **API Request/Response Types**: Đặt trong `src/modules/<module>/presentation/dto/` (ví dụ: `CreateProductDto`, `ProductDetailResponseDto`).
- **Global Shared Types**: Đặt trong `src/common/types/` (ví dụ: `PaginationOptions`, `PaginationResponse<T>`, `ApiResponse<T>`).
- **Enums**: Đặt trong `src/enums/` hoặc `src/common/enums/`.
