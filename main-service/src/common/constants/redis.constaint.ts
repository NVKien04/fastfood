export const REDIS_KEYS = {
  CATEGORY: {
    PREFIX: 'cache:category:',
    ALL: 'cache:category:all',
    DETAIL_ID: 'cache:category:id:',
    DETAIL_SLUG: 'cache:category:slug:',
    PAGE: 'cache:category:page:',
    PATTERN: 'cache:category:*',
  },
  PRODUCT: {
    PREFIX: 'cache:product:',
    ALL: 'cache:product:all:',
    FEATURED: 'cache:product:featured:',
    DETAIL_ID: 'cache:product:detail:id:',
    DETAIL_SLUG: 'cache:product:detail:slug:',
    PAGE: 'cache:product:page:',
    PATTERN: 'cache:product:*',
  },
  COMBO: {
    PREFIX: 'cache:combo:',
    ALL: 'cache:combo:all:',
    DETAIL: 'cache:combo:detail:',
    PAGE: 'cache:combo:page:',
    PATTERN: 'cache:combo:*',
  },
  INGREDIENT: {
    PREFIX: 'cache:ingredient:',
    ALL: 'cache:ingredient:all:',
    BY_CATEGORY: 'cache:ingredient:category:',
    PATTERN: 'cache:ingredient:*',
  },
  COUPON: {
    PREFIX: 'cache:coupon:',
    ALL: 'cache:coupon:all:',
    DETAIL: 'cache:coupon:detail:',
    USER_COUPONS: 'cache:coupon:user:',
    PATTERN: 'cache:coupon:*',
  },
  CART: {
    PREFIX: 'cache:cart:',
    USER_CART: 'cache:cart:user:',
    PATTERN: 'cache:cart:*',
  },
  ORDER: {
    PREFIX: 'cache:order:',
    USER_ORDERS: 'cache:order:user:',
    DETAIL: 'cache:order:detail:',
    PATTERN: 'cache:order:*',
  },
  SEARCH: {
    PREFIX: 'cache:search:',
    SUGGEST: 'cache:search:suggest:',
  },
  AUTH: {
    PREFIX: 'cache:auth:',
    REFRESH_TOKEN: 'cache:auth:refresh_token:',
    BLACKLIST: 'cache:auth:blacklist:',
  },
};

export const REDIS_TTL = {
  CATEGORY: 86400, // 24h
  PRODUCT_DETAIL: 3600, // 1h
  PRODUCT_PAGE: 600, // 10 phút
  PRODUCT_FEATURED: 1800, // 30 phút
  COMBO: 3600, // 1h
  INGREDIENT: 86400, // 24h
  COUPON: 1800, // 30 phút
  CART: 604800, // 7 ngày
  ORDER: 300, // 5 phút
  SEARCH: 300, // 5 phút
};
