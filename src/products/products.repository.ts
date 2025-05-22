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
  Review,
} from '@libs/database/entities';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
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
import { ProductRequestDto } from './dto/productRequestDto';
import {
  UpdateProductCategoryDto,
  UpdateProductDetailDto,
  UpdateProductDto,
  UpdateProductImageDto,
  UpdateProductOptionGroupDto,
  UpdateProductPriceDto,
  UpdateProductTagDto,
} from './dto/updateProductDto';

@Injectable({ scope: Scope.REQUEST })
export class ProductsRepository extends BaseRepository {
  constructor(
    @InjectDataSource('default') defaultDataSource: DataSource,
    @Inject(REQUEST) request: Request,
  ) {
    super(defaultDataSource, request);
  }

  // 상품 slug 중복 유무 조회
  async findOneUniqueSlug(slug: string) {
    return await this.getRepository(Product).findOneBy({
      slug: slug,
    });
  }

  // 관련 상품 전체 조회
  async findSlug(slug: string) {
    const product = this.getRepository(Product)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.productPrices', 'productPrices')
      .where('product.slug LIKE :slug', { slug: `%${slug}` });

    return await product.getMany();
  }

  // 상품 ID 조회
  async findOneProductId(id: string) {
    return await this.getRepository(Product).findOneBy({ id: id });
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
    id: string,
    createProductDetailDto: CreateProductDetailDto,
  ) {
    const productDetail = this.getRepository(ProductDetail).create({
      productId: id,
      ...createProductDetailDto,
    });

    await this.getRepository(ProductDetail).save(productDetail);
  }

  // 상품 가격 정보 생성
  async createProductPrice(
    id: string,
    createProductPriceDto: CreateProductPriceDto,
  ) {
    const productPrice = this.getRepository(ProductPrice).create({
      productId: id,
      ...createProductPriceDto,
    });

    await this.getRepository(ProductPrice).save(productPrice);
  }

  // 상품 카테고리 정보 생성
  async createProductCategory(
    id: string,
    createProductCategoryDto: CreateProductCategoryDto[],
  ) {
    for (const newProductCategory of createProductCategoryDto) {
      const productCategory = this.getRepository(ProductCategory).create({
        productId: id,
        ...newProductCategory,
      });

      return await this.getRepository(ProductCategory).save(productCategory);
    }
  }

  // 상품 옵션 그룹 정보 생성
  async createProductOptionGroup(
    id: string,
    createProductOptionGroupDto: CreateProductOptionGroupDto[],
  ) {
    for (const newProductOptionGroup of createProductOptionGroupDto) {
      const productOptinonGroup = this.getRepository(ProductOptionGroup).create(
        {
          productId: id,
          name: newProductOptionGroup.name,
          displayOrder: newProductOptionGroup.displayOrder,
        },
      );

      const save =
        await this.getRepository(ProductOptionGroup).save(productOptinonGroup);

      // 상품 옵션 정보 생성
      for (const data of newProductOptionGroup.productOptions) {
        const productOption = this.getRepository(ProductOption).create({
          optionGroupId: save.id,
          name: data.name,
          additionalPrice: data.additionalPrice,
          sku: data.sku,
          stock: data.stock,
          displayOrder: data.displayOrder,
        });

        await this.getRepository(ProductOption).save(productOption);
      }
    }
  }

  // 상품 이미지 정보 생성
  async createProductImage(
    id: string,
    createProductImageDto: CreateProductImageDto[],
  ) {
    for (const newProductImage of createProductImageDto) {
      const productImage = this.getRepository(ProductImage).create({
        productId: id,
        ...newProductImage,
      });

      await this.getRepository(ProductImage).save(productImage);
    }
  }

  // 상품 태그 정보 생성
  async createProductTag(
    id: string,
    createProductTagDto: CreateProductTagDto[],
  ) {
    for (const newProductTag of createProductTagDto) {
      const productTag = this.getRepository(ProductTag).create({
        productId: id,
        ...newProductTag,
      });

      await this.getRepository(ProductTag).save(productTag);
    }
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
    } else {
      products.orderBy('product.createdAt', 'DESC');
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
      const productImageArray = [];
      for (const image of data.productImages) {
        if (image.isPrimary) {
          productImageArray.push({
            url: image?.url,
            alt_text: image?.altText,
          });
        }
      }
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
        primary_image: productImageArray,
        brand: {
          id: data.brand?.id,
          name: data.brand?.name,
        },
        seller: {
          id: data.seller?.id,
          name: data.seller?.name,
        },
        rating: reviewCount ? averageRating / reviewCount : 0,
        review_count: reviewCount,
        // inStock 재고 유무 쿼리 값이 발생한다면, 재고 존재 유무 조회 (boolean)
        in_stock: productRequestDto.inStock
          ? // 이거 고려 해봐야 함 -> 배열 처리로 해서 데이터 조회를 시도 할 것인지
            data.productOptionGroups[0]?.productOptions[0]?.stock > 0
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

    // category 데이터 가공 처리
    const categoryArray = [];
    if (result.productCategories?.length) {
      for (const category of result.productCategories) {
        categoryArray.push({
          id: category.category?.id,
          name: category.category?.name,
          slug: category.category?.slug,
          is_primary: category.isPrimary,
          parent: {
            id: category.category?.parentCategory?.id,
            name: category.category?.parentCategory?.name,
            slug: category.category?.parentCategory?.slug,
          },
        });
      }
    }

    // productOptionGroups 데이터 가공 처리
    const productOptionGroupArray = [];
    if (result.productOptionGroups?.length) {
      for (const optionGroup of result.productOptionGroups) {
        const groupData = {
          id: optionGroup?.id,
          name: optionGroup?.name,
          display_order: optionGroup?.displayOrder,
          options: [],
        };

        if (optionGroup.productOptions?.length) {
          for (const option of optionGroup.productOptions) {
            groupData.options.push({
              id: option?.id,
              name: option?.name,
              additional_price: option?.additionalPrice,
              sku: option?.sku,
              stock: option?.stock,
              display_order: option?.displayOrder,
            });
          }
        }
        productOptionGroupArray.push(groupData);
      }
    }

    // productImages 데이터 가공 처리
    const productImageArray = [];
    if (result.productImages?.length) {
      for (const image of result.productImages) {
        productImageArray.push({
          id: image?.id,
          url: image?.url,
          alt_text: image?.altText,
          is_primary: image?.isPrimary,
          display_order: image?.displayOrder,
          option_id: image?.optionId,
        });
      }
    }

    // productTags 데이터 가공 처리
    const productTagArray = [];
    if (result.productTags?.length) {
      for (const tag of result.productTags) {
        productTagArray.push({
          id: tag.tag?.id,
          name: tag.tag?.name,
          slug: tag.tag?.slug,
        });
      }
    }

    // reviews 데이터 가공 처리
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

    // 관련 추천 상품 조회
    const slugSplit = result.slug.split('-');
    const slug = await this.findSlug(slugSplit[slugSplit.length - 1]);

    // 현재 상세 조회한 ProductId의 slug와,
    // 별도로 추천 상품 조회를 시도한 slug와의 일치하지 않는 목록에 한해서 데이터를 가공 처리
    const recommendSlugArray = [];
    if (slug?.length) {
      for (const recommendProduct of slug) {
        if (recommendProduct.slug !== result.slug) {
          const slugData = {
            id: recommendProduct?.id,
            name: recommendProduct?.name,
            slug: recommendProduct?.slug,
            short_description: recommendProduct?.shortDescription,
            primary_image: [],
            base_price: null,
            sale_price: null,
            currency: null,
          };

          // 추천 상품에 대한 이미지 데이터 가공 처리
          for (const image of recommendProduct.productImages) {
            if (image?.isPrimary) {
              slugData.primary_image.push({
                url: image?.url,
                alt_text: image?.altText,
              });
            }
          }

          // 추천 상품에 대한 가격 데이터 가공 처리
          for (const price of recommendProduct.productPrices) {
            slugData.base_price = price.basePrice;
            slugData.sale_price = price.salePrice;
            slugData.currency = price.currency;
          }

          recommendSlugArray.push(slugData);
        }
      }
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
        // 할인율
        discount_percentage:
          ((result.productPrices[0]?.basePrice -
            result.productPrices[0]?.salePrice) /
            result.productPrices[0]?.basePrice) *
          100,
      },
      categories: categoryArray,
      option_groups: productOptionGroupArray,
      images: productImageArray,
      tags: productTagArray,
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
      // 관련 추천 상품 목록
      related_products: recommendSlugArray,
    };
  }

  // 상품 목록 수정
  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.getRepository(Product).findOneBy({
      id: id,
    });

    const merge = this.getRepository(Product).merge(product, updateProductDto);

    return await this.getRepository(Product).save(merge);
  }

  // 상품 상세 정보 수정
  async updateProductDetail(
    id: string,
    updateProductDetailDto: UpdateProductDetailDto,
  ) {
    await this.getRepository(ProductDetail).update(
      { productId: id },
      {
        ...updateProductDetailDto,
      },
    );
  }

  // 상품 가격 정보 수정
  async updateProductPrice(
    id: string,
    updateProductPriceDto: UpdateProductPriceDto,
  ) {
    await this.getRepository(ProductPrice).update(
      { productId: id },
      {
        ...updateProductPriceDto,
      },
    );
  }

  // 상품 카테고리 정보 수정
  async updateProductCategory(
    id: string,
    updateProductCategoryDto: UpdateProductCategoryDto[],
  ) {
    // 기존 카테고리 데이터 삭제
    await this.getRepository(ProductCategory).delete({ productId: id });
    for (const data of updateProductCategoryDto) {
      const category = this.getRepository(ProductCategory).create({
        productId: id,
        ...data,
      });

      this.getRepository(ProductCategory).save(category);
    }
  }

  // 상품 옵션 정보 수정
  async updateProductOptionGroup(
    id: string,
    updateProductOptionGroupDto: UpdateProductOptionGroupDto[],
  ) {
    // 기존 상품 옵션 그룹 조회
    const products = await this.getRepository(ProductOptionGroup).find({
      where: { productId: id },
    });

    if (products?.length) {
      for (const data of products) {
        // 기존 상품 옵션 데이터 삭제
        await this.getRepository(ProductOption).delete({
          optionGroupId: data.id,
        });
      }
    }

    // 기존 상품 옵션 그룹 삭제
    await this.getRepository(ProductOptionGroup).delete({
      productId: id,
    });

    for (const data of updateProductOptionGroupDto) {
      const productOptionGroup = this.getRepository(ProductOptionGroup).create({
        productId: id,
        name: data.name,
        displayOrder: data.displayOrder,
      });

      await this.getRepository(ProductOptionGroup).save(productOptionGroup);

      // 상품 옵션 정보 수정 값이 발생한다면 옵션 데이터 새로 생성
      for (const option of data.productOptions) {
        const productOption = this.getRepository(ProductOption).create({
          optionGroupId: productOptionGroup.id,
          ...option,
        });

        await this.getRepository(ProductOption).save(productOption);
      }
    }
  }

  // 상품 이미지 정보 수정
  async updateProductImage(
    id: string,
    updateProductImageDto: UpdateProductImageDto[],
  ) {
    // 기존 상품 이미지 삭제
    await this.getRepository(ProductImage).delete({ productId: id });
    for (const data of updateProductImageDto) {
      const image = this.getRepository(ProductImage).create({
        productId: id,
        ...data,
      });

      await this.getRepository(ProductImage).save(image);
    }
  }

  // 싱품 태그 정보 수정
  async updateProductTag(
    id: string,
    updateProductTagDto: UpdateProductTagDto[],
  ) {
    // 기존 상품 태그 정보 삭제
    await this.getRepository(ProductTag).delete({ productId: id });
    for (const data of updateProductTagDto) {
      const tag = this.getRepository(ProductTag).create({
        productId: id,
        ...data,
      });

      await this.getRepository(ProductTag).save(tag);
    }
  }

  // 상품 목록 삭제
  async deleteProduct(id: string) {
    await this.getRepository(Product).delete(id);
  }

  // 상품 상세 정보 삭제
  async deleteProductDetail(id: string) {
    await this.getRepository(ProductDetail).delete({ productId: id });
  }

  // 상품 가격 정보 삭제
  async deleteProductPrice(id: string) {
    await this.getRepository(ProductPrice).delete({ productId: id });
  }

  // 상품 카테고리 정보 삭제
  async deleteProductCategory(id: string) {
    await this.getRepository(ProductCategory).delete({ productId: id });
  }

  // 상품 옵션 정보 삭제
  async deleteProductOptionGroup(id: string) {
    const productOptionGroup = await this.getRepository(
      ProductOptionGroup,
    ).find({
      where: { productId: id },
    });

    for (const data of productOptionGroup) {
      await this.getRepository(ProductOption).delete({
        optionGroupId: data?.id,
      });
    }

    await this.getRepository(ProductOptionGroup).delete({ productId: id });
  }

  // 상품 이미지 정보 삭제
  async deleteProductImage(id: string) {
    await this.getRepository(ProductImage).delete({ productId: id });
  }

  // 상품 태그 정보 삭제
  async deleteProductTag(id: string) {
    await this.getRepository(ProductTag).delete({ productId: id });
  }

  // 상품 리뷰 목록 삭제
  async deleteProductReview(id: string) {
    await this.getRepository(Review).delete({ productId: id });
  }
}
