import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductPackageDto } from './dto/createProductDto';
import { ProductRequestDto } from './dto/ProductRequestDto';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  // 상품 생성
  async createProduct({
    products,
    productDetails,
    productPrices,
    productCategories,
    productOptionGroups,
    productImages,
    productTags,
  }: CreateProductPackageDto) {
    // 상품 slug 중복 여부 조회
    const slug = await this.productsRepository.findOneUniqueSlug(products.slug);

    if (slug) {
      throw new HttpException('Already Product Slug', HttpStatus.BAD_REQUEST);
    }

    // product 생성
    const product = await this.productsRepository.createProduct(products);

    // product-detail 생성
    await this.productsRepository.createProductDetail(
      product.id,
      productDetails,
    );

    // product-price 생성
    await this.productsRepository.createProductPrice(product.id, productPrices);

    // product-category 생성
    for (const data of productCategories) {
      await this.productsRepository.createProductCategory(product.id, data);
    }

    // product-option-group 생성
    for (const data of productOptionGroups) {
      await this.productsRepository.createProductOptionGroup(product.id, data);
    }

    // product-image 생성
    for (const data of productImages) {
      await this.productsRepository.createProductImage(product.id, data);
    }

    // product-tag 생성
    for (const data of productTags) {
      await this.productsRepository.createProductTag(product.id, data);
    }

    return {
      success: true,
      data: product,
      message: '상품 등록이 성공적으로 처리되었습니다.',
    };
  }

  // 상품 목록 전체 조회
  async find(productRequestDto: ProductRequestDto) {
    const products = await this.productsRepository.find(productRequestDto);
    return {
      success: true,
      data: {
        items: products,
        pagination: {
          total_items: products.length,
          total_pages: Math.ceil(products.length / productRequestDto.getTake()),
          current_page: productRequestDto.getPage(),
          per_page: productRequestDto.getTake(),
        },
      },
      message: '상품 목록을 성공적으로 조회했습니다.',
    };
  }

  // 상품 목록 상세 조회
  async findOne(id: string) {
    const product = await this.productsRepository.findOne(id);

    return {
      success: true,
      data: product,
      message: '상품 상세 정보를 성공적으로 조회했습니다.',
    };
  }
}
