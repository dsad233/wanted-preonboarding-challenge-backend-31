import { Injectable } from '@nestjs/common';
import { ProductCategoriesRepository } from './product-categories.repository';
import { ProductCategoryRequestDto } from './dto/productRequestDto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    private productCategoriesRepository: ProductCategoriesRepository,
  ) {}

  // 카테고리 목록 조회
  async find(level: number) {
    const category = await this.productCategoriesRepository.find(level);

    return {
      success: true,
      data: category,
      message: '카테고리 목록을 성공적으로 조회했습니다.',
    };
  }

  // 특정 카테고리의 상품 목록 조회
  async findOne(
    id: string,
    productCategoryRequestDto: ProductCategoryRequestDto,
  ) {
    const category =
      await this.productCategoriesRepository.findOneCategoryAndProduct(
        id,
        productCategoryRequestDto,
      );

    return {
      success: true,
      data: category,
      message: '카테고리 상품 목록을 성공적으로 조회했습니다.',
    };
  }
}
