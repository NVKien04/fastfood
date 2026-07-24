# 🍔 FastFood E-Commerce Backend System

Hệ thống Backend cho dự án đặt đồ ăn nhanh (FastFood) được thiết kế hiện đại, dễ dàng mở rộng và triển khai bằng **Docker Compose** hoặc chạy trực tiếp ở môi trường **Local Development**.

---

## 🚀 Tính năng nổi bật (Features)

Hệ thống bao gồm các phân hệ (modules) cốt lõi của một ứng dụng thương mại điện tử ẩm thực:

- **Authentication & Users**: Quản lý đăng ký, đăng nhập với JWT (Access token/Refresh token), phân quyền người dùng (Customer, Admin...).
- **Products & Variants**: Quản lý sản phẩm món ăn, nước uống cùng với các biến thể (kích thước, hương vị...).
- **Ingredients & Customization**: Cho phép khách hàng thêm/bớt các nguyên liệu (topping, sốt...) cho sản phẩm của mình khi đặt món.
- **Cart & Order Processing**: Quản lý giỏ hàng và quy trình đặt hàng, tích hợp lựa chọn các topping/nguyên liệu tùy biến.
- **Coupon System**: Áp dụng mã giảm giá trực tiếp vào đơn hàng.
- **Address & Reviews**: Quản lý địa chỉ giao hàng của người dùng và đánh giá sản phẩm.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: JWT, Passport
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Documentation**: Swagger API docs

---

## 🗄️ Thiết kế Cơ sở dữ liệu (Database Schema & Relationships)

Hệ thống sử dụng cơ sở dữ liệu quan hệ PostgreSQL với các thực thể chính được liên kết chặt chẽ qua cơ chế khóa ngoại và ORM TypeORM:

```mermaid
erDiagram
    users ||--oN addresses : "has many"
    users ||--o| cart : "has one"
    users ||--oN orders : "places many"
    users ||--oN reviews : "writes many"
    users ||--oN user_coupons : "claims many"
    coupons ||--oN user_coupons : "assigned to many"
    category ||--oN product : "contains many"
    category ||--oN ingredients : "contains many"
    product ||--oN product_variants : "has many variants"
    product ||--oN product_ingredients : "links"
    ingredients ||--oN product_ingredients : "links"
    cart ||--oN cart_items : "has many"
    product ||--oN cart_items : "referenced"
    product_variants ||--oN cart_items : "referenced"
    cart_items ||--oN cart_item_ingredients : "contains toppings"
    ingredients ||--oN cart_item_ingredients : "referenced"
    orders ||--oN order_items : "has many"
    product ||--oN order_items : "referenced"
    product_variants ||--oN order_items : "referenced"
    order_items ||--oN order_item_ingredients : "contains toppings"
    ingredients ||--oN order_item_ingredients : "referenced"
    orders ||--o| reviews : "has review"
    product ||--oN reviews : "gets reviews"
    addresses ||--oN orders : "delivers to"
```

### Các mối quan hệ cốt lõi:
1. **User & Auth**:
   - `users` (1) ── (N) `addresses`: Lưu trữ các địa chỉ nhận hàng của người dùng.
   - `users` (1) ── (1) `cart`: Mỗi người dùng sở hữu duy nhất 1 giỏ hàng hoạt động.
2. **Product Catalog**:
   - `category` (1) ── (N) `product`: Phân nhóm sản phẩm (Ví dụ: Pizza, Burger, Drinks).
   - `product` (1) ── (N) `product_variants`: Các lựa chọn về kích thước hoặc hương vị của sản phẩm kèm chênh lệch giá.
   - `category` (1) ── (N) `ingredients`: Phân nhóm các loại nguyên liệu/topping đi kèm.
   - `product` (N) ── (N) `ingredients` (Thông qua bảng trung gian `product_ingredients`): Khai báo những toppings nào khả dụng hoặc mặc định đi kèm với sản phẩm.
3. **Cart & Customization**:
   - `cart` (1) ── (N) `cart_items`: Các món ăn được bỏ vào giỏ hàng.
   - `cart_items` (1) ── (N) `cart_item_ingredients`: Danh sách các toppings tùy chỉnh mà người dùng chọn riêng cho phần ăn đó.
4. **Order History**:
   - `users` (1) ── (N) `orders`: Quản lý các đơn đặt hàng đã thực hiện.
   - `orders` (1) ── (N) `order_items`: Chi tiết các món ăn tại thời điểm mua (lưu vết độc lập tránh biến động giá).
   - `order_items` (1) ── (N) `order_item_ingredients`: Toppings thực tế khách đã đặt kèm món ăn tại thời điểm mua.
5. **Coupons & Reviews**:
   - `users` (N) ── (N) `coupons` (Thông qua bảng trung gian `user_coupons`): Quản lý quyền nhận và sử dụng mã giảm giá của từng user.
   - `orders` (1) ── (1) `reviews`: Mỗi đơn đặt hàng thành công chỉ được đánh giá tối đa 1 lần.

---

## 📁 Cấu trúc thư mục dự án (Repository Directory Structure)

```text
fastfood/
├── main-service/             # Source code của dịch vụ NestJS chính
│   ├── src/
│   │   ├── common/           # Middleware, Exception filters, Interceptors chung
│   │   ├── controllers/      # Bộ định tuyến API (Controllers)
│   │   ├── database/         # Migrations & Seeding dữ liệu mẫu
│   │   ├── dtos/             # Data Transfer Objects (Validation & Transformation)
│   │   ├── entities/         # Các thực thể cơ sở dữ liệu (TypeORM Entities)
│   │   ├── modules/          # Các module chức năng của NestJS
│   │   ├── services/         # Logic nghiệp vụ (Business logic)
│   │   └── main.ts           # Entry point của ứng dụng
│   ├── Dockerfile            # Cấu hình đóng gói container cho main-service
│   └── package.json          # Dependencies & scripts
├── docker-compose.yml        # Docker Compose cấu hình cho PostgreSQL & main-service
├── .env                      # Môi trường cho local
└── .env.prod                 # Môi trường cho môi trường Production/Staging
```

---

## ⚙️ Thiết lập môi trường (Environment Setup)

Trước khi khởi chạy, hãy tạo các file môi trường `.env` hoặc `.env.prod`.

**Mẫu cấu hình môi trường:**

```ini
# Application Port
PORT=3001

# Database Configuration
DB_HOST=postgres-db      # Đổi thành "localhost" nếu chạy node trực tiếp trên máy local
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=fastfood
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
```

---

## 🏎️ Hướng dẫn khởi chạy (Getting Started)

Bạn có hai cách để khởi chạy dự án:

### Cách 1: Sử dụng Docker Compose (Khuyên dùng)

Cách này sẽ tự động tải và cấu hình PostgreSQL cùng NestJS main-service và kết nối chúng tự động.

1. Hãy chắc chắn bạn đã cài đặt Docker và Docker Desktop.
2. Khởi chạy toàn bộ hệ thống bằng câu lệnh:
   ```bash
   docker compose up --build -d
   ```
3. Hệ thống sẽ khởi tạo:
   - Cơ sở dữ liệu PostgreSQL tại cổng `5432` (chỉ mở tại local loopback `127.0.0.1` để bảo mật).
   - NestJS Application tại cổng `3001`.
4. Xem log của hệ thống:
   ```bash
   docker compose logs -f
   ```

### Cách 2: Chạy trực tiếp trên máy cá nhân (Local Development)

Yêu cầu đã cài đặt **Node.js (>= 18)** và **PostgreSQL** trên máy của bạn.

1. **Khởi động database**: Đảm bảo PostgreSQL đang chạy và bạn đã tạo cơ sở dữ liệu tên là `fastfood`.
2. **Cấu hình môi trường**:
   - Sao chép file cấu hình mẫu:
     ```bash
     cd main-service
     cp .env.example .env
     ```
   - Chỉnh sửa file `.env` vừa tạo để khớp với thông tin kết nối database local của bạn (nhớ đổi `DB_HOST` thành `localhost`).
3. **Cài đặt thư viện**:
   ```bash
   cd main-service
   npm install
   ```
4. **Chạy Migration**: Tạo bảng cơ sở dữ liệu dựa trên các migration có sẵn:
   ```bash
   npm run mig:run
   ```
5. **Nạp dữ liệu mẫu (Seed Data)**:
   ```bash
   npx ts-node -r tsconfig-paths/register src/database/seeds.ts
   ```
6. **Khởi động Server ở chế độ dev**:
   ```bash
   npm run start:dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:3001/api`

---

## 📖 Tài liệu API (Swagger API Documentation)

Dự án tích hợp sẵn tài liệu tương tác Swagger giúp bạn dễ dàng chạy thử nghiệm các API trực tiếp trên giao diện web.

Sau khi khởi chạy ứng dụng thành công, truy cập:

- **Swagger UI**: [http://localhost:3001/api](http://localhost:3001/api) hoặc [http://localhost:3001/swagger](http://localhost:3001/swagger)
- **Swagger JSON**: [http://localhost:3001/swagger/json](http://localhost:3001/swagger/json)

---

## 🗄️ Quản lý Database Migration (TypeORM)

Để quản lý cấu trúc bảng trong PostgreSQL, dự án sử dụng TypeORM migrations. Bạn có thể sử dụng các câu lệnh sau từ thư mục `main-service`:

- **Chạy các migrations chưa được thực thi**:
  ```bash
  npm run mig:run
  ```
- **Hoàn tác (Revert) migration gần nhất**:
  ```bash
  npm run mig:revert
  ```
- **Tự động sinh file migration dựa trên thay đổi của Entity**:
  ```bash
  npm run mig:generate -- src/database/migrations/<TênMigration>
  ```

---

## 🧪 Kiểm thử (Testing)

Từ thư mục `main-service`:

```bash
# Chạy Unit Tests
npm run test

# Chạy End-to-End Tests (E2E)
npm run test:e2e

# Đo lường độ bao phủ kiểm thử (Test Coverage)
npm run test:cov
```

---

## 📝 Quy chuẩn Code (Linting & Formatting)

Từ thư mục `main-service`:

```bash
# Kiểm tra và sửa lỗi formatting với Prettier
npm run format

# Kiểm tra lỗi cú pháp và quy chuẩn với ESLint
npm run lint
```
