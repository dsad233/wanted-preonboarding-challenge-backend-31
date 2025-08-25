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
}
