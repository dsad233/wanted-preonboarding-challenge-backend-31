import { STATUS, TYPE } from '@libs/enums';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsJsonObject } from '../../common/utils';

export class CreateProductDto {
  @IsNotEmpty({ message: 'name(상품명)은 필수 항목입니다.' })
  @IsString()
  @MaxLength(255, { message: 'Max Length 255' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsNotEmpty({ message: 'slug(URL 슬러그)는 필수 항목입니다.' })
  @IsString()
  @MaxLength(255, { message: 'Max Length 255' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Max Length 500' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  fullDescription?: string;

  @IsNotEmpty({ message: 'sellerId는 필수 항목입니다.' })
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  sellerId: string;

  @IsNotEmpty({ message: 'brandId는 필수 항목입니다.' })
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  brandId: string;

  @IsNotEmpty({ message: 'status(상품 상태 정보)는 필수 항목입니다.' })
  @IsEnum(STATUS.ProductStatus)
  @MaxLength(20, { message: 'Max Length 20' })
  status: STATUS.ProductStatus;
}

// 상품 상세 정보 생성 DTO
export class CreateProductDetailDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '무게 값은 0보다 커야 합니다.' })
  weight?: number;

  @IsOptional()
  @IsJsonObject({ message: '올바르지 않은 타입 입니다.' })
  dimensions?: Record<string, number>;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  materials?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  countryOfOrigin?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  warrantyInfo?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  careInstructions?: string;

  @IsOptional()
  @IsJsonObject({ message: '올바르지 않은 타입 입니다.' })
  additionalInfo?: Record<string, number>;
}

// 상품 가격 정보 생성 DTO
export class CreateProductPriceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '기본 가격은 0보다 커야 합니다.' })
  basePrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '할인 가격은 0보다 커야 합니다.' })
  salePrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '원가 가격은 0보다 커야 합니다.' })
  costPrice?: number;

  @IsOptional()
  @IsEnum(TYPE.CurrencyType)
  currency?: TYPE.CurrencyType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '세율은 0보다 커야 합니다.' })
  taxRate?: number;
}

// 상품 카테고리 정보 생성 DTO
export class CreateProductCategoryDto {
  @IsNotEmpty({ message: 'categoryId는 필수 항목입니다.' })
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

// 상품 옵션 그룹 정보 생성 DTO
export class CreateProductOptionGroupDto {
  @IsNotEmpty({ message: 'name(상품 옵션 그룹명)은 필수 항목입니다.' })
  @IsString()
  @MaxLength(100, { message: 'Max Length 100' })
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  displayOrder?: number;

  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionDto)
  productOptions: CreateProductOptionDto[];
}

// 상품 옵션 정보 생성 DTO
export class CreateProductOptionDto {
  @IsNotEmpty({ message: 'name(옵션명)은 필수 항목입니다.' })
  @IsString()
  @MaxLength(255, { message: 'Max Length 255' })
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: '추가 가격은 0보다 커야 합니다.' })
  additionalPrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Max Length 100' })
  sku?: string;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

// 상품 이미지 생성 DTO
export class CreateProductImageDto {
  @IsNotEmpty({ message: 'url(이미지 URL) 항목은 필수 항목입니다.' })
  @IsString()
  @MaxLength(255, { message: 'Max Length 255' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Max Length 255' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  altText?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  optionId?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

// 상품 태그 생성 DTO
export class CreateProductTagDto {
  @IsNotEmpty({ message: 'tagId는 필수 항목입니다.' })
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  tagId: string;
}

// 상품 등록 통합 DTO
export class CreateProductPackageDto {
  @ValidateNested()
  @Type(() => CreateProductDto)
  product: CreateProductDto;

  @ValidateNested()
  @Type(() => CreateProductDetailDto)
  productDetail: CreateProductDetailDto;

  @ValidateNested()
  @Type(() => CreateProductPriceDto)
  productPrice: CreateProductPriceDto;

  @ValidateNested({ each: true })
  @Type(() => CreateProductCategoryDto)
  productCategories: CreateProductCategoryDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionGroupDto)
  productOptionGroups: CreateProductOptionGroupDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  productImages: CreateProductImageDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateProductTagDto)
  productTags: CreateProductTagDto[];
}

/**
 * 상품 리뷰
 */

// 상품 리뷰 등록 DTO
export class CreateProductReviewDto {
  @IsNotEmpty({ message: 'rating(평점)은 필수 항목입니다.' })
  @IsNumber()
  rating: number;

  @IsNotEmpty({ message: 'title(리뷰 제목)은 필수 항목입니다.' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsNotEmpty({ message: 'content(리뷰 내용)은 필수 항목입니다.' })
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
}
