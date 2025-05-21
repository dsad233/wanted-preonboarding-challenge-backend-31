import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { CreateProductOptionDto } from 'src/products/dto/createProductDto';
import { UpdateProductOption } from 'src/products/dto/updateProductDto';

@Controller('product-options')
export class ProductOptionsController {
  constructor(private readonly productOptionsService: ProductOptionsService) {}

  // 상품 옵션 추가
  @Post()
  async create(@Body() createProductOptionDto: CreateProductOptionDto) {
    return await this.productOptionsService.create(createProductOptionDto);
  }

  // 상품 옵션 수정
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductOption: UpdateProductOption,
  ) {
    return await this.productOptionsService.update(id, updateProductOption);
  }

  // 상품 옵션 삭제
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.productOptionsService.delete(id);
  }
}
