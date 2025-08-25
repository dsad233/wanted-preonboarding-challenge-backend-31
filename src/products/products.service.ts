import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import {
  CreateProductImageDto,
  CreateProductPackageDto,
  CreateProductReviewDto,
} from './dto/createProductDto';
import {
  ProductRequestDto,
  ProductReviewRequestDto,
} from './dto/productRequestDto';
import { UpdateProductPackageDto } from './dto/updateProductDto';
import { RedisRepository } from 'src/redis/redis.repository';

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private redisRepository: RedisRepository,
  ) {}

  // 상품 생성
  async create({
    product,
    productDetail,
    productPrice,
    productCategories,
    productOptionGroups,
    productImages,
    productTags,
  }: CreateProductPackageDto): Promise<object> {
    // 상품 slug 중복 여부 조회
    const slug = await this.productsRepository.findOneUniqueSlug(product.slug);

    if (slug) {
      throw new HttpException('Already Product Slug', HttpStatus.BAD_REQUEST);
    }

    // product 생성
    const productData = await this.productsRepository.createProduct(product);

    // product-detail 생성
    await this.productsRepository.createProductDetail(
      productData.id,
      productDetail,
    );

    // product-price 생성
    await this.productsRepository.createProductPrice(
      productData.id,
      productPrice,
    );

    // product-category 생성
    await this.productsRepository.createProductCategory(
      productData.id,
      productCategories,
    );

    // product-option-group 생성
    await this.productsRepository.createProductOptionGroup(
      productData.id,
      productOptionGroups,
    );

    // product-image 생성
    await this.productsRepository.createProductImage(
      productData.id,
      productImages,
    );

    // product-tag 생성
    await this.productsRepository.createProductTag(productData.id, productTags);

    return {
      success: true,
      data: {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        created_at: productData.createdAt,
        updated_at: productData.updatedAt,
      },
      message: '상품이 성공적으로 등록되었습니다.',
    };
  }

  // 상품 목록 전체 조회
  async find(productRequestDto: ProductRequestDto): Promise<object> {
    const cached = await this.redisRepository.get(
      `products:page=${productRequestDto.getPage()}:pages=${productRequestDto.getTake()}:sort=${productRequestDto.sort}:status=${productRequestDto.status}:seller=${productRequestDto.seller}:brand=${productRequestDto.brand}:minPrice=${productRequestDto.minPrice}:maxPrice=${productRequestDto.maxPrice}:inStock=${productRequestDto.inStock}:category=${productRequestDto.category}:search=${productRequestDto.search}`,
    );

    if (!cached) {
      const products = await this.productsRepository.find(productRequestDto);
      await this.redisRepository.setex(
        `products:page=${productRequestDto.getPage()}:pages=${productRequestDto.getTake()}:sort=${productRequestDto.sort}:status=${productRequestDto.status}:seller=${productRequestDto.seller}:brand=${productRequestDto.brand}:minPrice=${productRequestDto.minPrice}:maxPrice=${productRequestDto.maxPrice}:inStock=${productRequestDto.inStock}:category=${productRequestDto.category}:search=${productRequestDto.search}`,
        120000,
        JSON.stringify(products),
      );

      return {
        success: true,
        data: {
          items: products,
          pagination: {
            total_items: products.length,
            total_pages: Math.ceil(
              products.length / productRequestDto.getTake(),
            ),
            current_page: productRequestDto.getPage(),
            per_page: productRequestDto.getTake(),
          },
        },
        message: '상품 목록을 성공적으로 조회했습니다.',
      };
    } else {
      return {
        success: true,
        data: {
          items: JSON.parse(cached),
          pagination: {
            total_items: JSON.parse(cached).length,
            total_pages: Math.ceil(
              JSON.parse(cached).length / productRequestDto.getTake(),
            ),
            current_page: productRequestDto.getPage(),
            per_page: productRequestDto.getTake(),
          },
        },
        message: '상품 목록을 성공적으로 조회했습니다.',
      };
    }
  }

  // 상품 목록 상세 조회
  async findOne(id: string): Promise<object> {
    const cached = await this.redisRepository.get(`product:id=${id}`);

    if (!cached) {
      const product = await this.productsRepository.findOne(id);

      await this.redisRepository.setex(
        `product:id=${id}`,
        300000,
        JSON.stringify(product),
      );

      return {
        success: true,
        data: product,
        message: '상품 상세 정보를 성공적으로 조회했습니다.',
      };
    } else {
      return {
        success: true,
        data: JSON.parse(cached),
        message: '상품 상세 정보를 성공적으로 조회했습니다.',
      };
    }
  }

  // 상품 목록 수정
  async update(
    id: string,
    {
      product,
      productDetail,
      productPrice,
      productCategories,
      productOptionGroups,
      productImages,
      productTags,
    }: UpdateProductPackageDto,
  ): Promise<object> {
    const productData = await this.productsRepository.findOneProductId(id);
    if (!productData) {
      throw new HttpException('RESOURCE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const slug = await this.productsRepository.findOneUniqueSlug(product.slug);
    if (slug) {
      throw new HttpException('Already Product Slug', HttpStatus.BAD_REQUEST);
    }

    // 상품 목록 수정
    const update = await this.productsRepository.updateProduct(id, product);

    // 상품 상세 정보 수정
    await this.productsRepository.updateProductDetail(update.id, productDetail);

    // 상품 가격 정보 수정
    await this.productsRepository.updateProductPrice(update.id, productPrice);

    // 상품 카테고리 정보 수정
    await this.productsRepository.updateProductCategory(
      update.id,
      productCategories,
    );

    // 상품 옵션 정보 수정
    await this.productsRepository.updateProductOptionGroup(
      update.id,
      productOptionGroups,
    );

    // 상품 이미지 정보 수정
    await this.productsRepository.updateProductImage(update.id, productImages);

    // 상품 태그 정보 수정
    await this.productsRepository.updateProductTag(update.id, productTags);

    return {
      success: true,
      data: {
        id: update.id,
        name: update.name,
        slug: update.slug,
        updated_at: update.updatedAt,
      },
      message: '상품이 성공적으로 수정되었습니다.',
    };
  }

  // 상품 목록 삭제
  async delete(id: string): Promise<object> {
    // 상품 목록 삭제
    await this.productsRepository.deleteProduct(id);

    // 상품 상세 정보 삭제
    await this.productsRepository.deleteProductDetail(id);

    // 상품 가격 정보 삭제
    await this.productsRepository.deleteProductPrice(id);

    // 상품 카테고리 정보 삭제
    await this.productsRepository.deleteProductCategory(id);

    // 상품 옵션 정보 삭제
    await this.productsRepository.deleteProductOptionGroup(id);

    // 상품 이미지 정보 삭제
    await this.productsRepository.deleteProductImage(id);

    // 상품 태그 정보 삭제
    await this.productsRepository.deleteProductTag(id);

    // 상품 리뷰 목록 삭제
    await this.productsRepository.deleteProductReview(id);

    return {
      success: true,
      message: '상품이 성공적으로 삭제되었습니다.',
    };
  }

  // 상품 소프트 삭제
  async softDelete(id: string): Promise<object> {
    await this.productsRepository.softDeleteProduct(id);

    return {
      success: true,
      message: '상품이 성공적으로 삭제되었습니다.',
    };
  }

  /**
   * 상품 이미지
   */

  // 상품 이미지 추가
  async createImage(
    id: string,
    createProductImageDto: CreateProductImageDto[],
  ): Promise<object> {
    await this.productsRepository.createProductImage(id, createProductImageDto);

    return {
      success: true,
      message: '상품 이미지가 성공적으로 추가되었습니다.',
    };
  }

  /**
   * 상품 리뷰
   */

  // 상품 리뷰 조회
  async findReviews(
    id: string,
    productReviewRequestDto: ProductReviewRequestDto,
  ): Promise<object> {
    const reviews = await this.productsRepository.findReviews(
      id,
      productReviewRequestDto,
    );

    return {
      success: true,
      data: reviews,
      message: '상품 리뷰를 성공적으로 조회했습니다.',
    };
  }

  // 상품 리뷰 등록
  async createProductReview(
    id: string,
    createProductReviewDto: CreateProductReviewDto,
    userId: string,
  ): Promise<object> {
    const review = await this.productsRepository.createProductReview(
      id,
      createProductReviewDto,
      userId,
    );

    return {
      success: true,
      data: review,
      message: '리뷰가 성공적으로 등록되었습니다.',
    };
  }
}
