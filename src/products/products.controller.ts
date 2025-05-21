import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductImageDto,
  CreateProductPackageDto,
} from './dto/createProductDto';
import { TransactionInterceptor } from 'src/utils/interceptors/transaction.interceptor';
import { ProductRequestDto } from './dto/productRequestDto';
import { UpdateProductPackageDto } from './dto/updateProductDto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 상품 등록
  @UseInterceptors(TransactionInterceptor)
  @Post()
  async create(
    @Body() createProductDto: CreateProductPackageDto,
  ): Promise<object> {
    return await this.productsService.create(createProductDto);
  }

  // 상품 목록 전체 조회
  @Get()
  async find(@Query() productRequestDto: ProductRequestDto): Promise<object> {
    return await this.productsService.find(productRequestDto);
  }

  // 상품 목록 상세 조회
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<object> {
    return await this.productsService.findOne(id);
  }

  // 상품 목록 수정
  @UseInterceptors(TransactionInterceptor)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductPackageDto: UpdateProductPackageDto,
  ): Promise<object> {
    return await this.productsService.update(id, updateProductPackageDto);
  }

  // 상품 목록 삭제
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<object> {
    return await this.productsService.delete(id);
  }

  // 상품 이미지 추가
  @Post('/:id/image')
  async createImage(
    @Param('id') id: string,
    @Body() createProductImageDto: CreateProductImageDto[],
  ) {
    return await this.productsService.createImage(id, createProductImageDto);
  }
}
