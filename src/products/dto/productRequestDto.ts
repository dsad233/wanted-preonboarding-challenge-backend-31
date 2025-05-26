import { STATUS } from '@libs/enums';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationRequestDto } from 'src/common/utils';

// 상품 목록 조회 DTO
export class ProductRequestDto extends PaginationRequestDto {
  // 상품 상태 필터
  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsEnum(STATUS.ProductStatus)
  status?: STATUS.ProductStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  // 카테고리 ID Array []
  @IsOptional()
  @Transform(({ value }) => (value?.length ? [...value.split(',')] : undefined))
  @IsArray()
  category?: string[];

  // 판매자 ID
  @IsOptional()
  @IsString()
  seller?: string;

  // 브랜드 ID
  @IsOptional()
  @IsString()
  brand?: string;

  // 재고 유무 필터
  @IsOptional()
  // truty 로 인한 문제로 인하여, 직접 변환을 시도 하여야 함.
  @Transform(({ value }) => (value === 'true' ? true : false))
  @IsBoolean()
  inStock?: boolean;

  // 검색어
  @IsOptional()
  @IsString()
  search?: string;
}

// 상품 리뷰 조회 DTO
export class ProductReviewRequestDto extends PaginationRequestDto {
  // 상품 상태 필터
  @IsOptional()
  @IsString()
  sort?: string;

  // 평점 필터 (1-5)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number;
}
