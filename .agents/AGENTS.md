# Project Rules

## TypeScript
- **Không sử dụng `any`** trong toàn bộ dự án. Sử dụng `unknown`, generic type, hoặc type cụ thể thay thế.

## Next.js & Frontend Architecture Rules

### 1. Quy tắc về App Router (`web/app/**/page.tsx`)
- **Không viết trực tiếp code UI/logic nghiệp vụ** trong các file `page.tsx`.
- Các file `page.tsx` chỉ đóng vai trò là nơi import và export component/module từ thư mục `features/` (hoặc metadata/layout cấu hình).

### 2. Cấu trúc Feature Module (`web/features/<feature-name>/`)
Mỗi feature phải tuân theo cấu trúc module hóa khép kín:
```
features/
└── <feature-name>/
    ├── components/   # Các UI components phục vụ riêng cho feature (e.g., LoginForm, StepWizard, etc.)
    ├── hooks/        # Custom React hooks xử lý logic của feature, API hooks (React Query / mutations / queries) quản lý Loading, Error, Cache, Refetch (e.g., useLogin, useRegister, useCreateProduct, etc.)
    ├── utils/        # Helper functions, formatters, Zod schemas dành riêng cho feature
    ├── types.ts      # TypeScript types/interfaces cho feature
    └── index.ts      # Export công khai các component/hook cần dùng bên ngoài
```

### 3. Quy tắc về API & Logic State
- Tất cả các xử lý API logic bao gồm **Loading, Error, Cache, Refetch, Mutate** đều phải được đóng gói gọn trong custom hook (ví dụ: `useLogin`, `useRegister`, `useCreateProduct`, `useGetProducts`,...).
- Tách biệt rõ ràng giữa Presentation Component (UI) và Logic Hook.
- Tất cả các form trong ứng dụng đều bắt buộc sử dụng **React Hook Form + Zod**.

## Backend & NestJS Architecture Rules (`main-service/`)

### 1. Quy tắc về Enum & Swagger DTO
- Tất cả các trường có tập giá trị cố định (fixed values / status / type / folder / role...) **bắt buộc phải khai báo dưới dạng TypeScript `enum`** trong thư mục `src/enums/` và export tại `src/enums/index.ts`.
- Khi khai báo field Enum trong các file DTO:
  - **Bắt buộc truyền `enumName: '<EnumName>'`** trong `@ApiProperty` / `@ApiPropertyOptional` để Swagger tạo schema dạng named `$ref`, đảm bảo Frontend (`swagger-typescript-api`) sinh ra đúng kiểu `export enum <EnumName>` có tên riêng biệt thay vì dạng chuỗi ghép (string union):
    ```typescript
    @ApiPropertyOptional({
      description: 'Mô tả trường',
      enum: MyEnum,
      enumName: 'MyEnum', // <-- BẮT BUỘC để gen ra export enum MyEnum ở frontend
      example: MyEnum.VALUE,
      default: MyEnum.DEFAULT,
    })
    @IsOptional()
    @IsEnum(MyEnum)
    myField?: MyEnum;
    ```
  - Luôn kết hợp decorator `@IsEnum(<EnumName>)` từ `class-validator` để validate request payload.
- Trong TypeORM Entity:
  - Cấu hình rõ `type: 'enum'` và `enum: <EnumName>` cho các cột dữ liệu tương ứng.

