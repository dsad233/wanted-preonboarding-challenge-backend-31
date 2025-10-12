import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from '../../common/pagination/paginationRequestDto';

export class ProductCategoryRequestDto extends PaginationRequestDto {
  // 상품 상태 필터
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  sort?: string;

  // 하위 카테고리 포함 여부
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeSubcategories: boolean;
}
