import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductPackageDto } from './dto/createProductDto';
import { TransactionInterceptor } from 'src/utils/interceptors/transaction.interceptor';
import { ProductRequestDto } from './dto/ProductRequestDto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 상품 등록
  @UseInterceptors(TransactionInterceptor)
  @Post()
  async createProduct(@Body() createProductDto: CreateProductPackageDto) {
    return await this.productsService.createProduct(createProductDto);
  }

  // 상품 목록 전체 조회
  @Get()
  async find(@Query() productRequestDto: ProductRequestDto) {
    return await this.productsService.find(productRequestDto);
  }

  // 상품 목록 상세 조회
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }
}
