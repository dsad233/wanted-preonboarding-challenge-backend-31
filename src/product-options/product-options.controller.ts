import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { CreateProductOptionDto } from 'src/products/dto/createProductDto';
import { UpdateProductOption } from 'src/products/dto/updateProductDto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@Controller('product-options')
export class ProductOptionsController {
  constructor(private readonly productOptionsService: ProductOptionsService) {}

  // 상품 옵션 추가
  @Post()
  async create(
    @Body() createProductOptionDto: CreateProductOptionDto,
  ): Promise<object> {
    return await this.productOptionsService.create(createProductOptionDto);
  }

  // 상품 옵션 수정
  @UseInterceptors(TransactionInterceptor)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductOption: UpdateProductOption,
  ): Promise<object> {
    return await this.productOptionsService.update(id, updateProductOption);
  }

  // 상품 옵션 삭제
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<object> {
    return await this.productOptionsService.delete(id);
  }
}
