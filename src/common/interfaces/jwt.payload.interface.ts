// 토큰 검증 반환
export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}
