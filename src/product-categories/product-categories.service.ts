import { Injectable } from '@nestjs/common';
import { ProductCategoriesRepository } from './product-categories.repository';
import { ProductCategoryRequestDto } from './dto/productCategoryRequestDto';
import { RedisRepository } from '../redis/redis.repository';
import { TYPE } from '@libs/enums';

@Injectable()
export class ProductCategoriesService {
  constructor(
    private productCategoriesRepository: ProductCategoriesRepository,
    private redisRepository: RedisRepository,
  ) {}

  // 카테고리 목록 조회
  async find(level: number): Promise<object> {
    const cached = await this.redisRepository.get(
      `${TYPE.PrefixType.CATEGORIES}:level=${level}`,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const categories = await this.productCategoriesRepository.find(level);

    const response = {
      success: true,
      data: categories,
      message: '카테고리 목록을 성공적으로 조회했습니다.',
    };

    await this.redisRepository.setex(
      `${TYPE.PrefixType.CATEGORIES}:level=${level}`,
      120000,
      JSON.stringify(categories),
    );

    return response;
  }

  // 특정 카테고리의 상품 목록 조회
  async findOne(
    id: string,
    productCategoryRequestDto: ProductCategoryRequestDto,
  ): Promise<object> {
    const cached = await this.redisRepository.get(
      `${TYPE.PrefixType.CATEGORY}:page=${productCategoryRequestDto.getPage()}:pages=${productCategoryRequestDto.getTake()}:includeSubcategories=${productCategoryRequestDto.includeSubcategories}`,
    );

    if (cached) {
      return JSON.parse(cached);
    }

    const category =
      await this.productCategoriesRepository.findOneCategoryAndProduct(
        id,
        productCategoryRequestDto,
      );

    const response = {
      success: true,
      data: category,
      message: '카테고리 상품 목록을 성공적으로 조회했습니다.',
    };

    await this.redisRepository.setex(
      `${TYPE.PrefixType.CATEGORY}:page=${productCategoryRequestDto.getPage()}:pages=${productCategoryRequestDto.getTake()}:includeSubcategories=${productCategoryRequestDto.includeSubcategories}`,
      300000,
      JSON.stringify(response),
    );

    return response;
  }
}
