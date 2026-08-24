export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PRODUCTS: '/products',
  PRODUCTS_CREATE: '/products/create',
  CATEGORIES: '/categories',
  ORDERS: '/orders',
  USERS: '/users',
  COUPONS: '/coupons',
  INGREDIENTS: '/ingredients',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
