# 🍔 FastFood Main Service (NestJS Application)

Thư mục này chứa mã nguồn cho **main-service**, là dịch vụ backend chính trong hệ thống FastFood, được phát triển bằng **NestJS**, **TypeORM**, và kết nối tới **PostgreSQL**.

---

## 📁 Cấu trúc thư mục (Directory Structure)

```text
src/
├── common/           # Middleware, Filters, Interceptors & Decorators dùng chung
│   ├── filter/       # Xử lý Exception tập trung (AllExceptionFilter)
│   ├── interceptors/ # Định dạng cấu trúc Response trả về (ApiResponseInterceptor)
│   └── middleware/   # Đo lường thời gian phản hồi (StartTimingMiddleware)
├── controllers/      # Chịu trách nhiệm định tuyến & tiếp nhận HTTP Requests
├── database/         # Quản lý Database Migrations & Seeds dữ liệu mẫu
├── dtos/             # Data Transfer Objects hỗ trợ validation đầu vào bằng class-validator
├── entities/         # Các Class mô tả cấu trúc bảng (TypeORM Entities)
├── enums/            # Các Enum dùng chung toàn hệ thống
├── guards/           # Bảo vệ các API bằng quyền truy cập
├── modules/          # Module NestJS nhóm các Controller, Service tương ứng
├── repositories/     # Lớp truy xuất cơ sở dữ liệu (Database access layer)
├── services/         # Nơi thực hiện Business Logic của ứng dụng
├── strategies/       # Cấu hình Passport Strategy cho Auth (JWT, Local)
├── utils/            # Các hàm tiện ích
└── main.ts           # Điểm khởi chạy ứng dụng (Bootstrap)
```

---

## 🛠️ Hướng dẫn cài đặt nhanh (Quickstart)

### Yêu cầu hệ thống

- **Node.js**: >= 18
- **npm** hoặc **yarn**
- **Cơ sở dữ liệu**: PostgreSQL đang chạy và đã cấu hình trong file `.env`.

### Các bước thực hiện

1. **Cài đặt thư viện**:

   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   Sao chép tệp mẫu và cập nhật các thông số cần thiết:

   ```bash
   cp .env.example .env
   ```

3. **Chạy các Migrations**:

   ```bash
   npm run mig:run
   ```

4. **Nạp dữ liệu mẫu (Seed Data)**:
   Nạp dữ liệu mẫu ban đầu về các danh mục món ăn (Categories):

   ```bash
   npx ts-node -r tsconfig-paths/register src/database/seeds.ts
   ```

5. **Khởi chạy ứng dụng ở chế độ nhà phát triển**:
   ```bash
   npm run start:dev
   ```

---

## 📜 Các Scripts thông dụng

| Script              | Ý nghĩa                                                        |
| :------------------ | :------------------------------------------------------------- |
| `npm run start`     | Khởi chạy server production                                    |
| `npm run start:dev` | Khởi chạy server ở chế độ watch mode (tự tải lại khi code đổi) |
| `npm run build`     | Biên dịch mã TypeScript sang JavaScript trong thư mục `/dist`  |
| `npm run lint`      | Chạy công cụ kiểm tra lỗi linter (ESLint)                      |
| `npm run format`    | Tự động căn chỉnh và format code với Prettier                  |
| `npm run test`      | Khạy kiểm thử unit test                                        |
| `npm run test:e2e`  | Chạy kiểm thử tích hợp đầu cuối (End-to-End)                   |

---

## 🗄️ Database Migrations

Sử dụng các lệnh TypeORM CLI sau để tạo/chạy migration:

- **Chạy các file migration mới**: `npm run mig:run`
- **Revert migration cuối**: `npm run mig:revert`
- **Tự động sinh file migration**: `npm run mig:generate -- src/database/migrations/<MigrationName>`

---

## 📖 Swagger API Docs

- Giao diện Swagger UI: `http://localhost:3001/api` hoặc `http://localhost:3001/swagger`
- File JSON tài liệu: `http://localhost:3001/swagger/json`
