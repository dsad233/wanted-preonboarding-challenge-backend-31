import { STATUS } from '@libs/enums';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationRequestDto } from '../../common/pagination/paginationRequestDto';

// 상품 목록 조회 DTO
export class ProductRequestDto extends PaginationRequestDto {
  // 상품 상태 필터
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
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
  @IsArray()
  @Transform(({ value }) => (value?.length ? [...value.split(',')] : undefined))
  category?: string[];

  // 판매자 ID
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  seller?: string;

  // 브랜드 ID
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  brand?: string;

  // 재고 유무 필터
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  inStock?: boolean;

  // 검색어
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
  search?: string;
}

// 상품 리뷰 조회 DTO
export class ProductReviewRequestDto extends PaginationRequestDto {
  // 상품 상태 필터
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  sort?: string;

  // 평점 필터 (1-5)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rating?: number;
}
