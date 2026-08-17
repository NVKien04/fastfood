---
name: FastFood Web Coding Conventions
description: Coding rules and conventions for the FastFood Web project (Next.js)
---

# FastFood Web — Coding Conventions

## 1. Component Source Priority (in order)

1. **`@/components/ui/`** — Base UI primitives (Button, Dialog, Input, Card, Badge, Sheet, DropdownMenu, Avatar...)
2. **`@/components/`** — Shared project-level components (`LanguageSwitcher`, `Header`, etc.)
3. **`@/modules/`** — Feature & page-level modules (`modules/product/`, `modules/checkout/`, `modules/profile/`...)

## 2. Navigation — Next.js App Router

Use standard Next.js App Router navigation:

- Use `useRouter()` from `next/navigation` for programmatic navigation.
- Use `<Link>` from `next/link` for declarative links.

```tsx
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Programmatic navigation
const router = useRouter();
const _onGoToCheckout = useCallback(() => {
  router.push('/checkout');
}, [router]);

// Declarative navigation
<Link href="/product" className="text-primary hover:underline">
  View Products
</Link>;
```

## 3. No Inline Styles, No Separate CSS Files

- **NEVER** use `style={{}}` inline styles in code.
- **NEVER** create separate `.css` files for individual components.
- **ALWAYS** use **Tailwind CSS** utility classes for all styling.

## 4. Function Naming Convention

- **Internal functions** (used only within the component/handlers): prefix with `_` (underscore).
  - Example: `_handleClick`, `_onChangeCategory`, `_onSubmitOrder`, `_onSelectVariant`
- **External / exported helper functions**: camelCase without underscore prefix.
  - Example: `formatVND`, `generateCartItemId`, `calculateTotalPrice`

## 5. Component Hook Ordering

Inside a component, code **MUST** be organized in this order, separated by blank lines between groups:

```tsx
export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ productId, isOpen, onClose }) => {
  // 1. Next.js Router & navigation hooks
  const router = useRouter();
  const pathname = usePathname();

  // 2. Translation hook
  const { t } = useTranslation();

  // 3. Local state & refs
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponseDto | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // 4. Zustand global state
  const addItem = useStore((state) => state.addItem);
  const locale = useStore((state) => state.locale);

  // 5. React Query hooks (queries & mutations)
  const { data: product, isLoading } = useProductDetail(productId);
  const createOrderMutation = useCreateOrder();

  // 6. Memoized values (useMemo)
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const variantPrice = selectedVariant?.modifiedPrice || 0;
    return ((product.basePrice || 0) + variantPrice) * quantity;
  }, [product, selectedVariant, quantity]);

  // 7. Effects (useEffect)
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  // 8. Event handlers & internal functions (useCallback)
  const _handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem({
      product,
      variant: selectedVariant,
      quantity,
    });
    onClose();
  }, [product, selectedVariant, quantity, addItem, onClose]);

  // 9. Return JSX
  return <div>{/* Component UI */}</div>;
};
```

## 6. useCallback and useMemo Required

- All **internal handler functions** inside components **MUST** use `useCallback`.
- All **computed / derived values** inside components **MUST** use `useMemo`.

```tsx
const _onSelectCategory = useCallback((categoryId: number | null) => {
  setSelectedCategoryId(categoryId);
  setPage(1);
}, []);

const filteredProducts = useMemo(() => {
  if (!productsData?.data) return [];
  return productsData.data.filter((item) => item.isActive);
}, [productsData]);
```

## 7. File Naming Convention

| File type                                | Naming                          | Example                                                             |
| ---------------------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| `.tsx` (UI components, modals)           | **PascalCase**                  | `ProductList.tsx`, `ProductDetailModal.tsx`, `LanguageSwitcher.tsx` |
| `.tsx` (Next.js App Router conventions)  | **kebab-case / lowercase**      | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`                |
| `.helper.ts` (module-specific helpers)   | **`*.helper.ts`**               | `product.helper.ts`, `cart.helper.ts`, `checkout.helper.ts`         |
| `.slice.ts` (Zustand slices)             | **`*.slice.ts`**                | `auth.slice.ts`, `cart.slice.ts`, `app.slice.ts`                    |
| `.ts` (hooks, configs, constants, utils) | **camelCase** or **kebab-case** | `product-keys.ts`, `query-client.ts`, `i18n.ts`, `currency.ts`      |

## 8. Project Structure & Directory Responsibilities

```
web/
├── app/              ← Next.js App Router (layout.tsx, page.tsx, checkout/, product/, profile/, login/)
├── assets/           ← Static assets (images, fonts, svg...)
├── components/       ← Reusable shared components
│   └── ui/           ← Base UI primitives (Button, Dialog, Input, Card, Badge, Sheet...)
├── configs/          ← Global configuration files (i18n.ts, etc.)
├── constants/        ← Enums, query keys, routes, static data (theme.ts, language.ts, order.ts...)
├── helpers/          ← Domain/Module-specific business logic & data transformations (*.helper.ts)
├── hooks/            ← Reusable custom React hooks
├── lib/              ← Third-party library wrappers
├── locales/          ← i18n JSON translations (vi.json, en.json, ja.json)
├── modules/          ← Feature & page-level components (product/, checkout/, profile/)
├── providers/        ← React Context providers (AuthProvider, QueryProvider, I18nProvider)
├── services/
│   ├── apis/         ← API HTTP clients (main/ -> ApiMain singleton, generated DTOs)
│   └── react-query/  ← React Query hooks (queries/, mutations/, constants/, query-client.ts)
├── stores/           ← Zustand global state store (index.ts, type.ts, slices/)
├── types/            ← Global TypeScript types & utility types
└── utils/            ← General application-wide utilities (currency.ts, time.ts, format.ts, cn helper...)
```

### Key Rules

- **`app/`**: Route files only. Keep them lean: declare route `metadata` and mount/re-export feature modules from `@/modules/`.
- **`modules/`**: Contains page-level and feature-specific UI components (`modules/product/`, `modules/checkout/`, `modules/profile/`).
- **`components/ui/`**: Headless/customized primitives (Shadcn / Base UI). Do not put app-specific business logic here.
- **`services/apis/`**: API definitions and Swagger-generated clients. Handled via `ApiMain.instance`.
- **`services/react-query/`**: Custom hooks wrapping `useQuery` / `useMutation` for all server state.
- **`stores/`**: Zustand slices for client-side state (`auth.slice.ts`, `cart.slice.ts`, `app.slice.ts`).
- **`constants/`**: All enums, query keys, action types, and static datasets.
- **`helpers/`**: Module-specific logic and transformations. **All helper files MUST end with `.helper.ts`** (e.g., `helpers/product.helper.ts`, `helpers/checkout.helper.ts`, `helpers/cart.helper.ts`).
- **`utils/`**: Module-agnostic common utilities used across the whole app (e.g., `formatVND`, `formatDate`, `cn`).
- **`locales/`**: All user-facing text must be defined in `vi.json`, `en.json`, `ja.json`. Never hardcode display text.

## 9. API Call Architecture

API calls follow a strict 3-layer pattern:

```
services/apis/main/    →  services/react-query/    →  Component (module)
(ApiMain HTTP clients)    (useQuery / useMutation)    (call react-query hook)
```

- **Layer 1 — `services/apis/`**: Define HTTP methods and API modules via `ApiMain.instance`.
- **Layer 2 — `services/react-query/`**: Wrap API calls in custom React Query hooks (`useProductList`, `useCreateOrder`).
- **Layer 3 — Component**: Call the React Query hook directly. **Never** call `ApiMain` directly from UI components.

## 10. Logic & Data Processing Extraction — `helpers/` vs `utils/`

`.tsx` files should contain **minimal logic**. All data processing, conversions, and formatters **MUST** be extracted into `helpers/` or `utils/`.

### 1. `utils/` — General / Application-wide Utilities

Common, module-agnostic utility functions used across multiple features throughout the entire application.

- Currency formatting: `formatVND(amount)`, `formatCurrency(amount, currency)`
- Date & time formatting: `formatDate(date)`, `formatTime(date)`, `formatRelativeTime(date)`
- String / number formatting, classname mergers (`cn`), etc.

```tsx
// utils/currency.ts
export const formatVND = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
    .format(price)
    .replace('₫', 'đ');
};

// Usage across any component:
import { formatVND } from '@/utils';
<span>{formatVND(product.basePrice)}</span>;
```

### 2. `helpers/` — Module-specific Business Logic & Transformations (`*.helper.ts`)

Logic, calculations, and data conversions tied to a specific domain or module. Organize files by module name with `.helper.ts` suffix (e.g., `helpers/product.helper.ts`, `helpers/checkout.helper.ts`, `helpers/cart.helper.ts`):

- Converting API response DTOs into display models.
- Sorting product variants / ingredients by price.
- Calculating dynamic unit prices and totals with selected modifiers.
- Transforming cart state into checkout/order payload DTOs.

```tsx
// helpers/product.helper.ts
import { ProductVariantResponseDto, ProductIngredientResponseDto } from '@/services/apis/main/generated/data-contracts';

export const sortProductVariants = (variants: ProductVariantResponseDto[] = []): ProductVariantResponseDto[] => {
  return [...variants].sort((a, b) => (a.modifiedPrice || 0) - (b.modifiedPrice || 0));
};

export const calculateProductUnitPrice = (
  basePrice: number,
  variant?: ProductVariantResponseDto | null,
  ingredients: ProductIngredientResponseDto[] = [],
): number => {
  const variantPrice = variant?.modifiedPrice || 0;
  const ingredientsPrice = ingredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
  return basePrice + variantPrice + ingredientsPrice;
};

// Usage inside component:
import { sortProductVariants, calculateProductUnitPrice } from '@/helpers';
const sortedVariants = useMemo(() => sortProductVariants(product?.variants), [product]);
```

## 11. App Router Structure

The project uses **Next.js App Router**:

```
app/
├── layout.tsx            ← Root layout with Providers (AuthProvider, QueryProvider, I18nProvider)
├── page.tsx              ← Home / Product List Page
├── login/
│   └── page.tsx          ← Authentication / Login Page
├── checkout/
│   └── page.tsx          ← Cart & Checkout Page
├── product/
│   ├── page.tsx          ← Product catalog
│   └── [slug]/
│       └── page.tsx      ← Product Detail (Dynamic route)
└── profile/
    └── page.tsx          ← User profile & order history
```

### Page File Template

```tsx
// app/product/page.tsx
import { Metadata } from 'next';
import { ProductList } from '@/modules/product/ProductList';

export const metadata: Metadata = {
  title: 'Menu & Products | FastFood',
  description: 'Explore delicious fast food meals and combos.',
};

export default function ProductPage() {
  return <ProductList />;
}
```

## 12. Dynamic Route Page Template

For dynamic route pages (e.g. `app/product/[slug]/page.tsx`):

```tsx
import { Metadata } from 'next';
import { ProductDetailModule } from '@/modules/product/ProductDetailModule';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return {
    title: `${title} | FastFood`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailModule slug={slug} />;
}
```

## 13. Module Structure

```
modules/
├── product/
│   ├── ProductList.tsx
│   ├── ProductDetailModal.tsx
│   └── ProductCard.tsx
├── checkout/
│   ├── CheckoutModule.tsx
│   ├── CartItemList.tsx
│   └── OrderSummary.tsx
└── profile/
    ├── UserProfile.tsx
    └── AvatarUpload.tsx
```

## 14. Client vs Server Components

- Components using React hooks (`useState`, `useEffect`, `useRouter`, `useStore`, React Query...) **MUST** declare `'use client';` at the very top.
- Page files in `app/` should remain **Server Components** when possible to support metadata and SSR optimization.

## 15. Icons — Use `lucide-react`

Import icons directly from `lucide-react`:

```tsx
import { ShoppingBag, ChevronRight, Search, Loader2, Plus, Check } from 'lucide-react';

<ShoppingBag className="w-5 h-5 text-primary" />
<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
```

## 16. Internationalization (i18n)

- All user-facing text **MUST** use translation keys via `useTranslation()` from `react-i18next`.
- Translation files: `locales/vi.json`, `locales/en.json`, `locales/ja.json`.
- Translation keys follow grouped uppercase keys: `COMMON.LOGIN`, `PRODUCT.ADD_TO_CART`, `CHECKOUT.TITLE`.

```tsx
import { useTranslation } from 'react-i18next';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header>
      <h1>{t('COMMON.APP_NAME')}</h1>
      <button>{t('PRODUCT.ADD_TO_CART')}</button>
    </header>
  );
};
```

## 17. Git Commit Message Format

Commit messages **MUST** follow the format: `<type>: <description>`

| Prefix      | Usage                                     |
| ----------- | ----------------------------------------- |
| `feat:`     | New feature                               |
| `fix:`      | Bug fix                                   |
| `update:`   | Update existing feature or logic          |
| `chore:`    | Maintenance, dependencies, config changes |
| `refactor:` | Code restructure without behavior change  |
| `style:`    | UI/styling changes only                   |
| `docs:`     | Documentation changes                     |
| `test:`     | Adding or updating tests                  |

**Examples:**

```
feat: add product variant selector in ProductDetailModal
fix: update cart total price calculation on ingredient toggle
chore: configure appSlice in zustand store
refactor: extract checkout summary into separate component
```

## 18. Static Constants Must Be in `constants/`

All static data that does not change at runtime (arrays, config maps, query keys, enums) **MUST** be placed in `constants/`. Do **NOT** define them inline inside components.

```tsx
// ❌ Bad — query key hardcoded or defined in component
const { data } = useQuery({ queryKey: ['PRODUCT_LIST', filter], ... });

// ✅ Good — imported from constants
// constants/product-keys.ts
export const PRODUCT_LIST = 'PRODUCT_LIST';

// services/react-query/queries/product.ts
import { PRODUCT_LIST } from '../constants/product-keys';
```

## 19. Export Style — `export const` Only

All components and functions **MUST** be exported using `export const` with arrow functions. Do **NOT** use `export default function` for component definitions. (Next.js page route files may default export the component).

```tsx
// ❌ Bad
export default function CheckoutModule() { ... }

// ✅ Good
export const CheckoutModule: React.FC = () => {
  return <div>...</div>;
};
```

## 20. Type Definition Style — Prefer `type` Over `interface`

Use `type` for defining data structures, props, and states:

```typescript
// ❌ Bad
interface UserProfileProps {
  userId: string;
  onSuccess: () => void;
}

// ✅ Good
type UserProfileProps = {
  userId: string;
  onSuccess: () => void;
};
```

## 21. No `any` and `as any` (STRICT RULE)

- **NEVER** use the `any` keyword anywhere in the codebase.
- **NEVER** cast using `as any` (e.g. `const data = obj as any`).
- Use `unknown`, generic types, or specific types (e.g., `Nullable<T>`, `BaseResponse<T>`).
