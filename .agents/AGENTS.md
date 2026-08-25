# Project Rules

## TypeScript
- **Không sử dụng `any`** trong toàn bộ dự án. Sử dụng `unknown`, generic type, hoặc type cụ thể thay thế.

## Next.js & Frontend Architecture Rules

### 1. Quy tắc về App Router (`web/app/**/page.tsx`)
- **Không viết trực tiếp code UI/logic nghiệp vụ** trong các file `page.tsx`.
- Các file `page.tsx` chỉ đóng vai trò là nơi import và export component/module từ thư mục `features/` (hoặc metadata/layout cấu hình).

### 2. Quy tắc về Coding Style trong React & Next.js
- **Không sử dụng tiền tố `React.`** khi dùng các hooks hoặc types (ví dụ: viết `useState`, `useEffect`, `ReactNode`, `useRef` thay vì `React.useState`, `React.useEffect`, `React.ReactNode`). Hãy import trực tiếp chúng từ thư viện `'react'`.
- **Không sử dụng kiểu `React.FC` hoặc `FC`** để định nghĩa Functional Components. Thay vào đó, hãy định nghĩa kiểu dữ liệu trực tiếp cho props của component:
  ```typescript
  export const MyComponent = ({ prop1, prop2 }: MyComponentProps) => {
    return <div>...</div>;
  };
  ```

### 3. Cấu trúc Feature Module (`web/features/<feature-name>/`)
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

### 4. Quy tắc về API & Logic State
- Tất cả các xử lý API logic bao gồm **Loading, Error, Cache, Refetch, Mutate** đều phải được đóng gói gọn trong custom hook (ví dụ: `useLogin`, `useRegister`, `useCreateProduct`, `useGetProducts`,...).
- Tách biệt rõ ràng giữa Presentation Component (UI) và Logic Hook.
- Tất cả các form trong ứng dụng đều bắt buộc sử dụng **React Hook Form + Zod**.

### 5. Quy tắc về Xử lý & Chuyển đổi dữ liệu (Data Transformation & Helpers)
- **Tất cả các hàm xử lý dữ liệu từ Backend / Raw Data sang dữ liệu hiển thị trên UI (hoặc payload gửi đi)** đều **bắt buộc phải được tách riêng thành helper functions** đặt trong thư mục `features/<feature-name>/utils/` (hoặc `helpers/` nếu là hàm dùng chung toàn cục giữa nhiều modules).
- **Không viết trực tiếp logic tính toán, transform, lọc (filter), gom nhóm (group), đếm (count), hoặc định dạng phức tạp** bên trong JSX components hoặc thân custom hooks. Hooks chỉ gọi các pure helper functions này để đảm bảo tính tái sử dụng, dễ đọc và dễ viết unit test.

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

