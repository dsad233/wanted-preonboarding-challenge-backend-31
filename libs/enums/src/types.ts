// 토큰 타입
export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

// Redis Prefix
export enum PrefixType {
  // token session
  SESSION = 'SESSION',
  // product_findOne Method
  PRODUCT = 'PRODUCT',
  // product_find Method
  PRODUCTS = 'PRODUCTS',
  // product_category_find Method
  CATEGORIES = 'CATEGORIES',
  // product_category_findOne Method
  CATEGORY = 'CATEGORY',
}
