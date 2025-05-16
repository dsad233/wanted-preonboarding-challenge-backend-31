import { BaseRepository } from '@libs/database';
import {
  Product,
  ProductCategory,
  ProductDetail,
  ProductImage,
  ProductOption,
  ProductOptionGroup,
  ProductPrice,
  ProductTag,
} from '@libs/database/entities';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CreateProductCategoryDto,
  CreateProductDetailDto,
  CreateProductDto,
  CreateProductImageDto,
  CreateProductOptionGroupDto,
  CreateProductPriceDto,
  CreateProductTagDto,
} from './dto/createProductDto';
import { ProductRequestDto } from './dto/ProductRequestDto';

@Injectable()
export class ProductsRepository extends BaseRepository {
  constructor(
    @InjectDataSource('default') defaultDataSource: DataSource,
    @Inject(REQUEST) request: Request,
  ) {
    super(defaultDataSource, request);
  }

  // slug 중복 유무 조회
  async findOneUniqueSlug(slug: string) {
    return await this.getRepository(Product).findOneBy({
      slug: slug,
    });
  }

  // 상품 생성
  async createProduct(createProductDto: CreateProductDto) {
    const product = this.getRepository(Product).create({
      ...createProductDto,
    });

    return await this.getRepository(Product).save(product);
  }

  // 상품 상세 정보 생성
  async createProductDetail(
    productId: string,
    createProductDetailDto: CreateProductDetailDto,
  ) {
    const productDetail = this.getRepository(ProductDetail).create({
      productId: productId,
      ...createProductDetailDto,
    });

    await this.getRepository(ProductDetail).save(productDetail);
  }

  // 상품 가격 정보 생성
  async createProductPrice(
    productId: string,
    createProductPriceDto: CreateProductPriceDto,
  ) {
    const productPrice = this.getRepository(ProductPrice).create({
      productId: productId,
      ...createProductPriceDto,
    });

    await this.getRepository(ProductPrice).save(productPrice);
  }

  // 상품 카테고리 생성
  async createProductCategory(
    productId: string,
    createProductCategoryDto: CreateProductCategoryDto,
  ) {
    const productCategory = this.getRepository(ProductCategory).create({
      productId: productId,
      ...createProductCategoryDto,
    });

    await this.getRepository(ProductCategory).save(productCategory);
  }

  // 상품 옵션 그룹 정보 생성
  async createProductOptionGroup(
    productId: string,
    { name, displayOrder, productOptions }: CreateProductOptionGroupDto,
  ) {
    const productOptinonGroup = this.getRepository(ProductOptionGroup).create({
      productId: productId,
      name: name,
      displayOrder: displayOrder,
    });

    const saveProductOptinonGroup =
      await this.getRepository(ProductOptionGroup).save(productOptinonGroup);

    // 상품 옵션 정보 생성
    for (const data of productOptions) {
      const productOption = this.getRepository(ProductOption).create({
        optionGroupId: saveProductOptinonGroup.id,
        name: data.name,
        additionalPrice: data.additionalPrice,
        sku: data.sku,
        stock: data.stock,
        displayOrder: data.displayOrder,
      });

      await this.getRepository(ProductOption).save(productOption);
    }
  }

  // 상품 이미지 정보 생성
  async createProductImage(
    productId: string,
    createProductImageDto: CreateProductImageDto,
  ) {
    const productImage = this.getRepository(ProductImage).create({
      productId: productId,
      ...createProductImageDto,
    });

    await this.getRepository(ProductImage).save(productImage);
  }

  // 상품 태그 정보 생성
  async createProductTag(
    productId: string,
    createProductTagDto: CreateProductTagDto,
  ) {
    const productTag = this.getRepository(ProductTag).create({
      productId: productId,
      ...createProductTagDto,
    });

    await this.getRepository(ProductTag).save(productTag);
  }

  // 상품 목록 전체 조회
  async find(productRequestDto: ProductRequestDto) {
    const products = this.getRepository(Product)
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productPrices', 'productPrices')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('product.productCategories', 'productCategories')
      .leftJoinAndSelect('product.productOptionGroups', 'productOptionGroups')
      .leftJoinAndSelect(
        'productOptionGroups.productOptions',
        'productOptions',
      );

    if (productRequestDto.page) {
      products.skip(productRequestDto.getSkip());
    }

    if (productRequestDto.take) {
      products.take(productRequestDto.getTake());
    }

    if (productRequestDto.sort?.toUpperCase()) {
      products.orderBy(
        'product.createdAt',
        productRequestDto.sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      );
    }

    if (productRequestDto.status) {
      products.andWhere('product.status = :status', {
        status: productRequestDto.status,
      });
    }

    if (productRequestDto.minPrice) {
      products.andWhere(
        `(productPrices.basePrice - COALESCE(productPrices.salePrice, ${0})) >= :minPrice`,
        {
          minPrice: productRequestDto.minPrice,
        },
      );
    }

    if (productRequestDto.maxPrice) {
      products.andWhere(
        `(productPrices.basePrice - COALESCE(productPrices.salePrice, ${0})) <= :maxPrice`,
        {
          maxPrice: productRequestDto.maxPrice,
        },
      );
    }

    if (productRequestDto.category) {
      products.andWhere('productCategories.id IN (:...id)', {
        id: productRequestDto.category,
      });
    }

    if (productRequestDto.brand) {
      products.andWhere('brand.id = :id', { id: productRequestDto.brand });
    }

    if (productRequestDto.seller) {
      products.andWhere('seller.id = :id', { id: productRequestDto.seller });
    }

    if (productRequestDto.search) {
      products.andWhere('product.name = :name', {
        name: productRequestDto.search,
      });
    }

    const result = (await products.getMany()).map((data) => {
      const review = data.reviews;
      let averageRating = 0;
      let reviewCount = 0;
      for (const data of review) {
        averageRating += data?.rating;
        reviewCount++;
      }
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        base_price: data.productPrices[0]?.basePrice,
        sale_price: data.productPrices[0]?.salePrice,
        currency: data.productPrices[0]?.currency,
        primary_image: {
          url: data.productImages[0]?.url,
          alt_text: data.productImages[0]?.altText,
        },
        brand: {
          id: data.brand?.id,
          name: data.brand?.name,
        },
        seller: {
          id: data.seller?.id,
          name: data.seller?.name,
        },
        rating: averageRating / reviewCount,
        review_count: reviewCount,
        // inStock 재고 유무 쿼리 값이 발생한다면, 재고 존재 유무 조회 (boolean)
        in_stock: productRequestDto.inStock
          ? data.productOptionGroups[0]?.productOptions[0]?.stock > 0
            ? true
            : false
          : undefined,
        status: data.status,
        created_at: data.createdAt,
      };
    });

    return result;
  }

  // 상품 목록 상세 조회
  async findOne(id: string) {
    const product = this.getRepository(Product)
      .createQueryBuilder('product')
      .where('product.id = :id', { id: id })
      .innerJoinAndSelect('product.seller', 'seller')
      .innerJoinAndSelect('product.brand', 'brand')
      .innerJoinAndSelect('product.productDetails', 'productDetails')
      .innerJoinAndSelect('product.productPrices', 'productPrices')
      .leftJoinAndSelect('product.productCategories', 'productCategories')
      .leftJoinAndSelect('productCategories.category', 'category')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .leftJoinAndSelect(
        'category.productCategories',
        'parentProductCategories',
      )
      .leftJoinAndSelect('productCategories.category', 'joinParentCategory')
      .leftJoinAndSelect('product.productOptionGroups', 'productOptionGroups')
      .leftJoinAndSelect('productOptionGroups.productOptions', 'productOptions')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.productTags', 'productTags')
      .leftJoinAndSelect('productTags.tag', 'tag')
      .leftJoinAndSelect('product.reviews', 'reviews');

    const result = await product.getOne();
    if (!result) {
      throw new HttpException('RESOURCE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const review = result.reviews;
    let averageRating = 0;
    let ratingCount = 0;
    let ratingFive = 0;
    let ratingFour = 0;
    let ratingThree = 0;
    let ratingTwo = 0;
    let ratingOne = 0;
    for (const data of review) {
      if (data.rating === 5) {
        ratingFive++;
      } else if (data.rating === 4) {
        ratingFour++;
      } else if (data.rating === 3) {
        ratingThree++;
      } else if (data.rating === 2) {
        ratingTwo++;
      } else if (data.rating === 1) {
        ratingOne++;
      }
      averageRating += data.rating;
      ratingCount++;
    }
    return {
      id: result.id,
      name: result.name,
      slug: result.slug,
      short_description: result.shortDescription,
      full_description: result.fullDescription,
      seller: {
        id: result.seller.id,
        name: result.seller.name,
        description: result.seller.description,
        logo_url: result.seller.logoUrl,
        rating: result.seller.rating,
        contact_email: result.seller.contactEmail,
        contact_phone: result.seller.contactPhone,
      },
      brand: {
        id: result.brand.id,
        name: result.brand.name,
        description: result.brand.description,
        logo_url: result.brand.logoUrl,
        website: result.brand.website,
      },
      status: result.status,
      created_at: result.createdAt,
      updated_at: result.updatedAt,
      detail: {
        weight: result.productDetails[0]?.weight,
        dimensions: result.productDetails[0]?.dimensions,
        materials: result.productDetails[0]?.materials,
        country_of_origin: result.productDetails[0]?.countryOfOrigin,
        warranty_info: result.productDetails[0]?.warrantyInfo,
        care_instructions: result.productDetails[0]?.careInstructions,
        additional_info: result.productDetails[0]?.additionalInfo,
      },
      price: {
        base_price: result.productPrices[0]?.basePrice,
        sale_price: result.productPrices[0]?.salePrice,
        currency: result.productPrices[0]?.currency,
        tax_rate: result.productPrices[0]?.taxRate,
        discount_percentage:
          ((result.productPrices[0]?.basePrice -
            result.productPrices[0]?.salePrice) /
            result.productPrices[0]?.basePrice) *
          100,
      },
      categories: {
        id: result.productCategories[0]?.category?.id,
        name: result.productCategories[0]?.category?.name,
        slug: result.productCategories[0]?.category?.slug,
        is_primary: result.productCategories[0]?.isPrimary,
        // 부모 관련 카테고리 조인 문제 발생하여 해결 필요
        parent: {
          id: result.productCategories[0]?.category?.parentCategory,
          name: result.productCategories[0]?.category?.parentCategory,
          // slug: result.productCategories[0]?.category?.parentCategory,
        },
      },
      option_groups: {
        id: result.productOptionGroups[0]?.id,
        name: result.productOptionGroups[0]?.name,
        display_order: result.productOptionGroups[0]?.displayOrder,
        options: {
          id: result.productOptionGroups[0]?.productOptions[0]?.id,
          name: result.productOptionGroups[0]?.productOptions[0]?.name,
          additional_price:
            result.productOptionGroups[0]?.productOptions[0]?.additionalPrice,
          sku: result.productOptionGroups[0]?.productOptions[0]?.sku,
          stock: result.productOptionGroups[0]?.productOptions[0]?.stock,
          display_order:
            result.productOptionGroups[0]?.productOptions[0]?.displayOrder,
        },
      },
      images: {
        id: result.productImages[0]?.id,
        url: result.productImages[0]?.url,
        alt_text: result.productImages[0]?.altText,
        is_primary: result.productImages[0]?.isPrimary,
        display_order: result.productImages[0]?.displayOrder,
        option_id: result.productImages[0]?.optionId,
      },
      tags: {
        id: result.productTags[0].tag?.id,
        name: result.productTags[0].tag?.name,
        slug: result.productTags[0].tag?.slug,
      },
      rating: {
        average: averageRating / ratingCount,
        count: ratingCount,
        distribution: {
          5: ratingFive,
          4: ratingFour,
          3: ratingThree,
          2: ratingTwo,
          1: ratingOne,
        },
      },
    };
  }
}
