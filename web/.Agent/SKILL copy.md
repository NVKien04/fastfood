---
name: Frontend Architecture & Conventions
description: Chuẩn kiến trúc và quy ước code Frontend (Next.js, TanStack Query, Zustand, i18n, API Layer, TypeScript & Tailwind)
---

# 🚀 FRONTEND ARCHITECTURE & CODING CONVENTIONS

Tài liệu quy chuẩn kiến trúc và quy tắc viết code dành cho dự án Frontend Next.js (App Router), áp dụng mô hình phân lớp rõ ràng, tối ưu hiệu năng và khả năng bảo trì.

---

## 1. 📁 CẤU TRÚC THƯ MỤC & TRÁCH NHIỆM PHÂN TẦNG

```
src/
├── app/                  # Route handlers & Pages (Server Components ONLY, định nghĩa metadata và re-export)
├── assets/               # File tĩnh (icons, fonts, images, svgs)
├── components/           # UI components tái sử dụng chung toàn app (Header, Footer, Dialog, Modal...)
├── configs/              # Cấu hình môi trường, app config, third-party sdk setup
├── constants/            # Enums, static data, router path, storage keys (KHÔNG hardcode trong component)
├── core/ui/              # Primitives UI / Design tokens (Button, Input, Select, Badge, Card...)
├── helpers/              # Pure business logic, data transformers (tách biệt hoàn toàn khỏi UI)
├── hooks/                # Custom React hooks dùng chung toàn app
├── lib/                  # Tiện ích từ thư viện bên ngoài (utils, formatters, cn)
├── locales/              # Cấu hình đa ngôn ngữ (i18n dictionary, JSON translation files)
├── models/               # Data models / Domain entities
├── modules/              # Toàn bộ UI logic theo từng trang/tính năng (chia theo group: main/, dashboard/)
├── providers/            # React Context Providers bọc ngoài app (QueryClient, Theme, Toast, Auth)
├── services/
│   ├── apis/             # Tầng gọi HTTP API (Axios instance, endpoints, generated DTOs)
│   ├── react-query/      # Tầng React Query (custom hooks: queries/, mutations/, query keys)
│   ├── auth/             # Service xác thực (OAuth Google, Facebook, Apple)
│   └── socket/           # WebSocket / Realtime client
├── store/                # Quản lý Global State (Zustand modular slices, selectors, persist)
├── types/                # TypeScript types dùng chung toàn app (type only, no interface)
└── utils/                # Các hàm tiện ích thuần túy (date, string, cookie, storage)
```

---

## 2. 🌐 INTERNATIONALIZATION (i18n) CONVENTIONS

### 2.1. Cấu trúc thư mục i18n

```
src/locales/
├── languages/
│   ├── en.json           # File ngôn ngữ tiếng Anh
│   └── vi.json           # File ngôn ngữ tiếng Việt
├── DictionaryProvider.tsx# Context provider truyền dictionary xuống client
├── dictionary-hook.ts    # Custom hook useDictionary()
├── dictionary.ts         # Server-side loader đọc file JSON dictionary
└── config.ts             # defaultLocale và danh sách locale hỗ trợ
```

### 2.2. Quy tắc đặt key i18n

- Toàn bộ key dịch phải viết theo định dạng **`SCREAMING_SNAKE_CASE`** kèm prefix module/phạm vi.
- Danh sách prefix chuẩn:
  - `COMMON_`: Các từ dùng chung (Lưu, Hủy, Đóng, Xác nhận, Thành công...)
  - `AUTH_`: Đăng nhập, Đăng ký, Quên mật khẩu, OTP, Đổi mật khẩu
  - `VALIDATION_`: Lỗi validate form từ Zod hoặc input rules
  - `MODAL_`: Tiêu đề, nội dung trong các popup/dialog
  - `HEADER_`, `FOOTER_`, `NAV_`: Điều hướng và bố cục
  - `[FEATURE]_`: Các tính năng nghiệp vụ cụ thể (vd: `CLASS_`, `FACILITY_`, `ORDER_`)

### 2.3. Quy tắc sử dụng trong Component

- **Tuyệt đối không hardcode text hiển thị** của người dùng trong JSX.
- Sử dụng hook `useDictionary()`:

```tsx
import useDictionary from '@/locales/dictionary-hook';

export const ProfileHeader = () => {
  const { t } = useDictionary();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">{t('AUTH_PROFILE_TITLE')}</h1>
      {/* Interpolation nếu có tham số */}
      <p className="text-sm text-gray-500">{t('COMMON_WELCOME_USER', { name: 'John Doe' })}</p>
    </div>
  );
};
```

---

## 3. 📦 GLOBAL STATE MANAGEMENT (ZUSTAND + IMMER + PERSIST)

### 3.1. Mô hình Modular Slices

Không viết một store khổng lồ tập trung vào một file. Chia thành các **Slice** theo từng domain nghiệp vụ.

```
src/store/
├── index.ts              # Root store kết hợp tất cả slices (create + immer + persist)
├── types.ts              # Định nghĩa StateSlice, Root Store Type
├── utilities.ts          # Bộ resetters và hàm resetAllSlices()
├── selectors/            # Các selector tinh gọn tránh re-render thừa
└── slices/
    ├── app.ts            # Quản lý theme, sidebar state, global loading
    ├── auth.ts           # Quản lý user profile, access token, auth modals
    └── ...               # Các domain slices khác
```

### 3.2. Cú pháp viết Slice chuẩn

```ts
// src/store/slices/auth.ts
import { StateSlice, Store } from '@/store/types';
import { resetters } from '@/store/utilities';

const initialAuthState = {
  currentUser: undefined,
  accessToken: undefined,
  isOpenModalLogin: false,
};

export type AuthSlice = {
  currentUser?: UserInfoModel;
  accessToken?: string;
  isOpenModalLogin: boolean;
  updateCurrentUser: (payload: Partial<UserInfoModel>) => void;
  updateAccessToken: (payload?: string) => void;
  toggleOpenModalLogin: (open: boolean) => void;
  resetAuth: () => void;
};

export const createAuthSlice: StateSlice<Store, AuthSlice> = (set) => {
  const updateCurrentUser = (payload: Partial<UserInfoModel>) => {
    return set((state) => {
      state.currentUser = { ...state.currentUser, ...payload };
    });
  };

  const updateAccessToken = (payload?: string) => {
    return set((state) => {
      state.accessToken = payload;
    });
  };

  const toggleOpenModalLogin = (payload: boolean) => {
    return set((state) => {
      state.isOpenModalLogin = payload;
    });
  };

  const resetAuth = () => {
    return set((state) => {
      state.currentUser = undefined;
      state.accessToken = undefined;
    });
  };

  // Đăng ký resetter khi logout
  resetters.push(() => set(initialAuthState));

  return {
    ...initialAuthState,
    updateCurrentUser,
    updateAccessToken,
    toggleOpenModalLogin,
    resetAuth,
  };
};
```

### 3.3. Quy tắc lấy State trong Component (Selector Pattern)

- **CẤM** lấy toàn bộ store: `const store = useStore()` ❌ (gây re-render toàn component khi bất kỳ state nào đổi).
- **BẮT BUỘC** sử dụng selector hoặc hàm trỏ:

```tsx
// ✅ Tốt: Tạo selector tái sử dụng
// src/store/selectors/auth.ts
export const selectIsLoggedIn = (state: Store) => !!state.accessToken;
export const selectCurrentUser = (state: Store) => state.currentUser;

// Trong component:
const isLoggedIn = useStore(selectIsLoggedIn);
const updateCurrentUser = useStore((state) => state.updateCurrentUser);
```

### 3.4. Cơ chế Reset Store khi Logout

- Khi logout, bắt buộc xóa token trong Cookies/Storage, xóa React Query cache, và gọi `resetAllSlices()`:

```ts
export const resetAuth = async () => {
  await ApiMain.instance.clearAuth();
  clearAuthenticateCookie();
  queryClient.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
  }
  resetAllSlices();
};
```

---

## 4. ⚡ TANSTACK REACT QUERY (DATA FETCHING & MUTATION)

Mô hình gọi API tuân thủ nghiêm ngặt **3 tầng (3-Layer Pattern)**:

```
[ TẦNG 1: HTTP API Client ]  -->  [ TẦNG 2: React Query Hooks ]  -->  [ TẦNG 3: UI Component ]
  src/services/apis/                src/services/react-query/             src/modules/
  (Axios, Types, Endpoints)          (queries/ & mutations/)               (useClassList, etc.)
```

### 4.1. Quản lý Query Keys tập trung (`constants/*-keys.ts`)

Tất cả Query Keys phải được định nghĩa trong file constant dưới dạng mảng hoặc hằng số.

```ts
// src/services/react-query/constants/class-keys.ts
export const CLASS_LIST = 'CLASS_LIST';
export const CLASS_DETAIL = 'CLASS_DETAIL';
export const CLASS_MEMBER_LIST = 'CLASS_MEMBER_LIST';
```

### 4.2. Viết Custom Query Hook (`services/react-query/queries/*.ts`)

- Luôn truyền `queryKey` có cấu trúc phân tầng: `[KEY, params]` hoặc `[KEY, id]`.
- Sử dụng `enabled` để kiểm soát điều kiện kích hoạt fetch (vd: có `id`, có `isLoggedIn`).
- Định nghĩa rõ kiểu dữ liệu trả về thông qua `BaseResponse<T>`.

```ts
// src/services/react-query/queries/class.ts
import { useQuery } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { CLASS_LIST, CLASS_DETAIL } from '../constants/class-keys';
import { DYNAMIC_CACHE } from '../constants/config';
import { ClassListParams, ClassDetailDto } from '@/services/apis/main/generated/data-contracts';

export const useClassList = (params: ClassListParams) => {
  const queryFn = async () => {
    const response = await ApiMain.instance.class.getClasses(params);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [CLASS_LIST, params],
    queryFn,
    enabled: !!params,
    ...DYNAMIC_CACHE,
  });
};

export const useClassDetail = (id: string) => {
  const queryFn = async () => {
    const response = await ApiMain.instance.class.getDetail(id);
    if (response.kind !== 'OK') return null;
    return response.data;
  };

  return useQuery({
    queryKey: [CLASS_DETAIL, id],
    queryFn,
    enabled: Boolean(id),
    ...DYNAMIC_CACHE,
  });
};
```

### 4.3. Viết Custom Mutation Hook (`services/react-query/mutations/*.ts`)

- Tự động invalidate cache khi mutation thành công thông qua `queryClient.invalidateQueries` hoặc helper `invalidateListQueries`.

```ts
// src/services/react-query/mutations/class.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiMain } from '@/services/apis/main/api.main';
import { CLASS_LIST, CLASS_DETAIL } from '../constants/class-keys';
import { CreateClassCommand } from '@/services/apis/main/generated/data-contracts';

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (payload: CreateClassCommand) => {
    const response = await ApiMain.instance.class.createClass(payload);
    if (response.kind !== 'OK') {
      throw new Error(response.message || 'Failed to create class');
    }
    return response.data;
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      // Invalidate danh sách để tự động refetch dữ liệu mới nhất
      queryClient.invalidateQueries({ queryKey: [CLASS_LIST] });
    },
  });
};
```

### 4.4. Quy tắc sử dụng trong Component

- **TUYỆT ĐỐI KHÔNG** gọi trực tiếp API method từ `services/apis/` trong component.
- Luôn sử dụng custom hook từ `services/react-query/`.

```tsx
// ✅ Đúng: Gọi qua React Query hook
export const ClassListView = () => {
  const [params, setParams] = useState<ClassListParams>({ pageNumber: 1, pageSize: 10 });
  const { data: classList, isLoading, isError } = useClassList(params);
  const { mutate: createClass, isPending: isCreating } = useCreateClass();
  ...
};
```

---

## 5. 🌐 API CLIENT & DATA CONTRACTS (AXIOS + OPENAPI)

### 5.1. Cấu trúc Tầng API

```
src/services/apis/
├── api.ts                # Base Axios client wrapper (xử lý interceptors, auth token, error status)
├── api.type.ts           # Định dạng response chuẩn: BaseResponse<T>, ApiProblem
├── api.problem.ts        # Map mã HTTP lỗi (400, 401, 403, 500) sang mã lỗi nội bộ
├── main/                 # Service API chính (API Gateway / Main Service)
│   ├── api.main.ts       # Singleton Class instance ApiMain.instance
│   └── generated/        # Auto-generated code từ Swagger (data-contracts.ts, endpoints)
└── identity/             # Service Auth / Identity
```

### 5.2. Chuẩn hóa BaseResponse

Mọi API endpoint khi trả về đều phải được bọc trong cấu trúc chuẩn:

```ts
export type BaseResponse<T> = {
  kind: 'OK' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'SERVER_ERROR' | 'TIMEOUT' | 'UNKNOWN';
  data?: T;
  message?: string;
  statusCode?: number;
};
```

---

## 6. 📝 FORM HANDLING & VALIDATION (REACT HOOK FORM + ZOD)

### 6.1. Nguyên tắc triển khai Form

1. Mọi Form đều phải định nghĩa **Zod Schema** cho validation.
2. Type của Form Data phải được suy diễn tự động qua `z.infer<typeof schema>`.
3. Sử dụng `@hookform/resolvers/zod` để liên kết Zod với `react-hook-form`.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useDictionary from '@/locales/dictionary-hook';

export const useCreateBookingForm = () => {
  const { t } = useDictionary();

  const bookingSchema = z.object({
    courtId: z.string().min(1, { message: t('VALIDATION_REQUIRED_COURT') }),
    date: z.string().min(1, { message: t('VALIDATION_REQUIRED_DATE') }),
    timeSlot: z.string().min(1, { message: t('VALIDATION_REQUIRED_TIME') }),
  });

  type BookingFormValues = z.infer<typeof bookingSchema>;

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      courtId: '',
      date: '',
      timeSlot: '',
    },
    mode: 'onBlur',
  });

  return { form, bookingSchema };
};
```

---

## 7. 🧩 COMPONENT STANDARDS & HOOK ORDERING

### 7.1. Cấu trúc thứ tự khai báo trong Component (MANDATORY)

Code bên trong một functional component phải tuân thủ nghiêm ngặt thứ tự sau:

```tsx
export const FacilityDetailCard = ({ facilityId }: { facilityId: string }) => {
  // 1. Next.js Routing hooks
  const pathname = usePathname();
  const router = useRouter();

  // 2. i18n & Context hooks
  const { t } = useDictionary();

  // 3. React Query hooks (Fetching & Mutations)
  const { data: facility, isLoading } = useFacilityDetail(facilityId);
  const { mutate: bookFacility, isPending } = useBookFacility();

  // 4. Zustand Store selectors
  const currentUser = useStore(selectCurrentUser);
  const isLoggedIn = useStore(selectIsLoggedIn);

  // 5. Local State (useState)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // 6. Computed Values (useMemo)
  const availableSlots = useMemo(() => {
    if (!facility) return [];
    return filterAvailableSlots(facility.slots);
  }, [facility]);

  // 7. Side Effects (useEffect)
  useEffect(() => {
    if (availableSlots.length > 0) {
      setSelectedSlot(availableSlots[0].id);
    }
  }, [availableSlots]);

  // 8. Event Handlers & Local Functions (useCallback - prefix bằng dấu '_')
  const _handleSelectSlot = useCallback((slotId: string) => {
    setSelectedSlot(slotId);
  }, []);

  const _handleBookingSubmit = useCallback(() => {
    if (!selectedSlot) return;
    bookFacility({ facilityId, slotId: selectedSlot });
  }, [bookFacility, facilityId, selectedSlot]);

  // 9. Render JSX
  return <div className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4">{/* UI Code */}</div>;
};
```

### 7.2. Quy tắc tối ưu Memoization

- **Tất cả các hàm xử lý sự kiện trong component** phải được bọc trong `useCallback`.
- **Tất cả các giá trị tính toán / lọc dữ liệu phức tạp** phải được bọc trong `useMemo`.
- **Hàm nội bộ component**: Bắt đầu bằng dấu gạch dưới `_` (vd: `_handleClick`, `_handleChangeDate`).
- **Hàm dùng chung / Export**: Không có dấu gạch dưới (vd: `formatCurrency`, `calculateDuration`).

### 7.3. Quy ước TypeScript

- **Dùng `type`, KHÔNG dùng `interface`**:
  ```ts
  // ❌ Tránh
  interface UserProps {
    name: string;
  }

  // ✅ Chuẩn
  type UserProps = {
    name: string;
    age?: number;
  };
  ```
- **TUYỆT ĐỐI KHÔNG dùng `any` hoặc ép kiểu `as any`**:
  - Dùng `unknown` kèm type guards hoặc định nghĩa type tường minh.
  - Sử dụng Generic Types (`T`, `K`) cho các hàm tiện ích.

### 7.4. Quy ước Export & Naming

- **Luôn dùng `export const`** dạng arrow function cho components và helper functions. Không dùng `export default function`.
- File component (`.tsx`): Đặt tên theo **PascalCase** (`CourseCard.tsx`, `HeaderNav.tsx`).
- File logic/helper/hook/constant (`.ts`): Đặt tên theo **camelCase** (`dateUtils.ts`, `useUser.ts`, `authKeys.ts`).

---

## 8. 🎨 STYLING & TAILWIND CSS CONVENTIONS

1. **Chỉ sử dụng Tailwind CSS Utility Classes**.
2. **CẤM sử dụng `style={{}}` inline style** (trừ trường hợp toạ độ động hoặc biến CSS động bất khả kháng).
3. **CẤM tạo file `.css` riêng cho từng component lẻ**. Mọi style phải thể hiện qua class name.
4. **Kết hợp Class Name**: Sử dụng hàm `cn()` (kết hợp `clsx` và `tailwind-merge`) để nối class có điều kiện:
   ```tsx
   import { cn } from '@/lib/utils';

   <button
     className={cn(
       'flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors',
       isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
       isDisabled && 'cursor-not-allowed opacity-50',
     )}
   >
     {buttonText}
   </button>;
   ```

---

## 9. 🧠 BUSINESS LOGIC & CONSTANT EXTRACTION

- **Tách triệt để Logic khỏi JSX**:
  - Logic tính toán, chuyển đổi dữ liệu phức tạp $\rightarrow$ Viết vào `src/helpers/` (vd: `src/helpers/court.ts`).
  - Toàn bộ mảng tĩnh, cấu hình menu, danh sách options, status enum $\rightarrow$ Đặt trong `src/constants/` (vd: `src/constants/booking.ts`).
- File component `.tsx` chỉ làm nhiệm vụ: **Liên kết State, gọi Hook và Render Giao diện**.

---

## 10. 🎯 KIỂM TRA CHẤT LƯỢNG TRƯỚC KHI COMMIT (CHECKLIST)

- [ ] Không có `any` hoặc `as any` trong toàn bộ code mới.
- [ ] Sử dụng `type` thay vì `interface`.
- [ ] Không hardcode text hiển thị (đã đăng ký trong `src/locales/languages/` và gọi qua `t()`).
- [ ] API calls tuân thủ 3 tầng: `services/apis/` $\rightarrow$ `services/react-query/` $\rightarrow$ `component`.
- [ ] State toàn cục qua Zustand được gọi bằng Selector riêng lẻ.
- [ ] Mọi hàm trong component được memoize bằng `useCallback`, giá trị tính toán bằng `useMemo`.
- [ ] Dữ liệu tĩnh được chuyển ra `src/constants/`.
- [ ] Toàn bộ component sử dụng `export const` và tuân thủ thứ tự Hook chuẩn.
- [ ] Chạy `npm run typecheck` và `npm run lint` không phát sinh lỗi.
