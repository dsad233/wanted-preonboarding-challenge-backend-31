import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

// 이메일 형식 검증
export const EmailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

// 페이지 네이션 DTO
// 참조: https://dev-seonghun.medium.com/nestjs-pagination-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0-62ddf15fe684
export class PaginationRequestDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  take?: number = 10;

  // 현재 페이지 번호
  getSkip() {
    return (this.page - 1) * this.take || 0;
  }

  // 입력된 페이지 번호
  getPage() {
    return this.page;
  }

  // 한 페이지에 노출되는 아이템 갯수
  getTake() {
    return this.take;
  }
}
