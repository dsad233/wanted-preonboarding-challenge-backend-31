import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { Public } from 'src/utils/decorators/ispublic.decorator';
import { ProductCategoryRequestDto } from './dto/productRequestDto';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  // 카테고리 목록 조회
  @Public()
  @Get()
  async find(@Query('level') level: number): Promise<object> {
    return await this.productCategoriesService.find(level);
  }

  // 특정 카테고리의 상품 목록 조회
  @Public()
  @Get('/:id')
  async findOne(
    @Param('id') id: string,
    @Query() productCategoryRequestDto: ProductCategoryRequestDto,
  ): Promise<object> {
    return await this.productCategoriesService.findOne(
      id,
      productCategoryRequestDto,
    );
  }
}
