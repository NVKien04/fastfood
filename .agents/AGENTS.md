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
