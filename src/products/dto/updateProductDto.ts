import { PartialType } from '@nestjs/mapped-types';
import {
  CreateProductCategoryDto,
  CreateProductDetailDto,
  CreateProductDto,
  CreateProductOptionDto,
  CreateProductOptionGroupDto,
  CreateProductPriceDto,
  CreateProductReviewDto,
  CreateProductTagDto,
} from './createProductDto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 상품 목록 수정 DTO
export class UpdateProductDto extends PartialType(CreateProductDto) {}

// 상품 정보 수정 DTO
export class UpdateProductDetailDto extends PartialType(
  CreateProductDetailDto,
) {}

// 상품 가격 정보 수정 DTO
export class UpdateProductPriceDto extends PartialType(CreateProductPriceDto) {}

// 상품 카테고리 정보 수정 DTO
export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto,
) {}

// 상품 옵션 그룹 정보 수정 DTO
export class UpdateProductOptionGroupDto extends PartialType(
  CreateProductOptionGroupDto,
) {}

// 상품 옵션 정보 수정 DTO
export class UpdateProductOption extends PartialType(CreateProductOptionDto) {}

// 상품 이미지 정보 수정 DTO
export class UpdateProductImageDto extends PartialType(CreateProductPriceDto) {}

// 상품 태그 정보 수정 DTO
export class UpdateProductTagDto extends PartialType(CreateProductTagDto) {}

// 상품 수정 통합 DTO
export class UpdateProductPackageDto {
  @ValidateNested()
  @Type(() => UpdateProductDto)
  product: UpdateProductDto;

  @ValidateNested()
  @Type(() => UpdateProductDetailDto)
  productDetail: UpdateProductDetailDto;

  @ValidateNested()
  @Type(() => UpdateProductPriceDto)
  productPrice: UpdateProductPriceDto;

  @ValidateNested({ each: true })
  @Type(() => UpdateProductCategoryDto)
  productCategories: UpdateProductCategoryDto[];

  @ValidateNested({ each: true })
  @Type(() => UpdateProductOptionGroupDto)
  productOptionGroups: UpdateProductOptionGroupDto[];

  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  productImages: UpdateProductImageDto[];

  @ValidateNested({ each: true })
  @Type(() => UpdateProductTagDto)
  productTags: UpdateProductTagDto[];
}

/*
 * 상품 리뷰
 */

// 상품 리뷰 수정 DTO
export class UpdateProductReviewDto extends PartialType(
  CreateProductReviewDto,
) {}
