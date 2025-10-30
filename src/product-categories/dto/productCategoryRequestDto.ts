import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from '../../common/pagination/paginationRequestDto';
import { valueToBoolean } from '../../common/utils';

export class ProductCategoryRequestDto extends PaginationRequestDto {
  // 상품 상태 필터
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim().toUpperCase())
  sort?: string;

  // 하위 카테고리 포함 여부
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => valueToBoolean(value?.trim()))
  @IsBoolean()
  includeSubcategories: boolean;
}
