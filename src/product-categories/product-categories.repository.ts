import { BaseRepository } from '@libs/database';
import { Category, Product } from '@libs/database/entities';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Not } from 'typeorm';
import { ProductCategoryRequestDto } from './dto/productCategoryRequestDto';
import { STATUS } from '@libs/enums';

@Injectable()
export class ProductCategoriesRepository extends BaseRepository {
  constructor(
    @InjectDataSource('default') defaultDataSource: DataSource,
    @Inject(REQUEST) request: Request,
  ) {
    super(defaultDataSource, request);
  }

  // 상품 총 갯수 조회
  async countProduct() {
    return await this.getRepository(Product).count({
      where: {
        status: Not(STATUS.ProductStatus.DELETED),
      },
    });
  }

  // 카테고리 목록 조회
  async find(level: number) {
    const category = this.getRepository(Category)
      .createQueryBuilder('category')
      .orderBy('category.level', 'ASC');

    if (level) {
      category.andWhere('category.level = :level', { level: level });
    }

    const map = new Map<string, any>();
    const roots: any[] = [];

    for (const cat of await category.getMany()) {
      map.set(cat.id, {
        ...cat,
        children: [],
      });
    }

    for (const data of map.values()) {
      // 카테고리 데이터에 parentId 데이터가 있는 경우에만 동작
      if (data.parentId) {
        // 카테고리 데이터에 parentId를 조회하여, 원본 category 데이터를 조회
        const parent = map.get(data.parentId);
        if (parent) {
          // 원본 category 데이터에 parentId를 가지고 있는 데이터를 매핑
          parent.children.push({
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            level: data.level,
            image_url: data.imageUrl,
            children: data.children,
          });
        } else {
          roots.push(data);
        }
      } else {
        roots.push(data);
      }
    }

    // 매핑 되지 않은 children 배열 삭제
    function removeEmptyChildren(nodes: any[]) {
      for (const node of nodes) {
        if (node.children.length === 0) {
          delete node.children;
        } else {
          removeEmptyChildren(node.children);
        }
      }
    }

    removeEmptyChildren(roots);

    return roots.map((data) => {
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        level: data.level,
        image_url: data.imageUrl,
        children: data.children,
      };
    });
  }

  // 특정 카테고리의 상품 목록 조회
  async findOneCategoryAndProduct(
    id: string,
    productCategoryRequestDto: ProductCategoryRequestDto,
  ) {
    const category = this.getRepository(Category)
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .where('category.id = :categoryId', {
        categoryId: id,
      });

    const categoryData = await category.getOne();

    const products = this.getRepository(Product)
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.productPrice', 'productPrice')
      .leftJoinAndSelect('product.productImages', 'productImages')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .leftJoinAndSelect('product.productCategories', 'productCategories')
      .leftJoinAndSelect('productCategories.category', 'category')
      .where('category.id = :id', { id: id })
      .andWhere('product.status != :status', {
        status: STATUS.ProductStatus.DELETED,
      });

    if (productCategoryRequestDto.page) {
      products.skip(productCategoryRequestDto.getSkip());
    }

    if (productCategoryRequestDto.take) {
      products.take(productCategoryRequestDto.getTake());
    }

    if (productCategoryRequestDto.sort?.toUpperCase()) {
      products.orderBy(
        'product.createdAt',
        productCategoryRequestDto.sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      );
    } else {
      products.orderBy('product.createdAt', 'DESC');
    }

    const productsData = await products.getMany();

    const productArray = [];
    for (const product of productsData ?? []) {
      let averageRating = 0;
      let reviewCount = 0;
      for (const review of product?.reviews) {
        averageRating += review.rating;
        reviewCount++;
      }

      productArray.push({
        id: product?.id,
        name: product?.name,
        slug: product?.slug,
        short_description: product?.shortDescription,
        base_price: product?.productPrice?.basePrice,
        sale_price: product?.productPrice?.salePrice,
        currency: product?.productPrice?.currency,
        primary_image: {
          url: product?.productImages[0]?.url,
          alt_text: product?.productImages[0]?.altText,
        },
        brand: {
          id: product?.brand?.id,
          name: product?.brand?.name,
        },
        seller: {
          id: product?.seller?.id,
          name: product?.seller?.name,
        },
        rating: reviewCount ? averageRating / reviewCount : 0,
        review_count: reviewCount,
        status: product?.status,
        created_at: product?.createdAt,
      });
    }

    const itemCount = await this.countProduct();

    return {
      category: {
        id: categoryData?.id,
        name: categoryData?.name,
        slug: categoryData?.slug,
        description: categoryData?.description,
        level: categoryData?.level,
        image_url: categoryData?.imageUrl,
        parent:
          productCategoryRequestDto.includeSubcategories === false
            ? undefined
            : {
                id: categoryData?.parentCategory?.id,
                name: categoryData?.parentCategory?.name,
                slug: categoryData?.parentCategory?.slug,
              },
      },
      item: productArray,
      pagination: {
        total_items: itemCount,
        total_pages: Math.ceil(itemCount / productCategoryRequestDto.getTake()),
        current_page: productCategoryRequestDto.getPage(),
        per_page: productCategoryRequestDto.getTake(),
      },
    };
  }
}
