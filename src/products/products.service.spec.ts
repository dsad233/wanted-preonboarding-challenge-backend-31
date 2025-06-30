import { Product } from '@libs/database/entities';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';
import { TestBed } from '@automock/jest';
import { STATUS } from '@libs/enums';
import {
  CreateProductCategoryDto,
  CreateProductDetailDto,
  CreateProductDto,
  CreateProductImageDto,
  CreateProductOptionGroupDto,
  CreateProductPackageDto,
  CreateProductPriceDto,
  CreateProductTagDto,
} from './dto/createProductDto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductRequestDto } from './dto/productRequestDto';
import e from 'express';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: jest.Mocked<ProductsRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductsService).compile();

    productsService = unit;
    productsRepository = unitRef.get(ProductsRepository);
  });

  describe('[상품 생성] create Method', () => {
    it('[상품 생성] create Success', async () => {
      const product = new Product();
      Object.assign(product, {
        id: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        name: 'test',
        slug: 'test-slug',
        shortDescription: 'test-short-description',
        fullDescription: 'test-full-description',
        sellerId: '304df7f7-04cc-4760-9f62-47669a19f149',
        brandId: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
        status: STATUS.ProductStatus.SOLDOUT,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newProduct: CreateProductDto = {
        name: 'test',
        slug: 'test-slug',
        shortDescription: 'test-short-description',
        fullDescription: 'test-full-escription',
        status: STATUS.ProductStatus.SOLDOUT,
        sellerId: '304df7f7-04cc-4760-9f62-47669a19f149',
        brandId: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
      };

      const newProductDetail: CreateProductDetailDto = {
        productId: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        weight: 100,
        dimensions: {
          width: 100,
          height: 100,
          depth: 100,
        },
        materials: 'test-material',
        countryOfOrigin: 'test-contry',
        warrantyInfo: 'test-warranty',
        careInstructions: 'test-care',
        additionalInfo: {
          assembly_required: 1,
          assembly_time: 30,
        },
      };

      const newProductPrice: CreateProductPriceDto = {
        productId: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        basePrice: 1000,
        salePrice: 1000,
        costPrice: 1000,
        currency: 'KRW',
        taxRate: 10,
      };

      const newProductCategories: CreateProductCategoryDto[] = [
        {
          categoryId: 'ce26d2d3-2a8d-4658-9225-98b2018f48f8',
          isPrimary: false,
        },
        {
          categoryId: '7c74562a-62cb-4cd5-9e3e-67186d8aa16d',
          isPrimary: false,
        },
      ];

      const newProductOptionGroups: CreateProductOptionGroupDto[] = [
        {
          name: 'test-1',
          displayOrder: 1,
          productOptions: [
            {
              name: 'test-option-1',
              additionalPrice: 1000,
              sku: 'test-1',
              stock: 10,
              displayOrder: 1,
            },
            {
              name: 'test-option-2',
              additionalPrice: 1001,
              sku: 'test-2',
              stock: 11,
              displayOrder: 2,
            },
          ],
        },
        {
          name: 'test-2',
          displayOrder: 2,
          productOptions: [
            {
              name: 'test-option-3',
              additionalPrice: 1002,
              sku: 'test-3',
              stock: 12,
              displayOrder: 3,
            },
            {
              name: 'test-option-4',
              additionalPrice: 1003,
              sku: 'test-4',
              stock: 13,
              displayOrder: 4,
            },
          ],
        },
      ];

      const newProductImages: CreateProductImageDto[] = [
        {
          url: 'http://test.com',
          altText: 'test-text',
          isPrimary: false,
          optionId: '4de9c208-152b-4a01-95eb-ea4b83ed1e50',
          displayOrder: 1,
        },
        {
          url: 'http://test1.com',
          altText: 'test-text-1',
          isPrimary: false,
          optionId: 'b24389cb-b425-460f-9e20-a9767645d06c',
          displayOrder: 2,
        },
      ];

      const newProductTags: CreateProductTagDto[] = [
        {
          tagId: 'fc59b618-0c2f-415c-bf58-bec3f43233e2',
        },
        {
          tagId: '2e9c8929-ca8d-47dd-b718-805dcd249bbb',
        },
      ];

      const productPackage: CreateProductPackageDto = {
        product: newProduct,
        productDetail: newProductDetail,
        productPrice: newProductPrice,
        productCategories: newProductCategories,
        productOptionGroups: newProductOptionGroups,
        productImages: newProductImages,
        productTags: newProductTags,
      };

      jest
        .spyOn(productsRepository, 'findOneUniqueSlug')
        .mockResolvedValue(undefined);

      jest
        .spyOn(productsRepository, 'createProduct')
        .mockResolvedValue(product);
      jest.spyOn(productsRepository, 'createProductDetail').mockResolvedValue();
      jest.spyOn(productsRepository, 'createProductPrice').mockResolvedValue();
      jest
        .spyOn(productsRepository, 'createProductCategory')
        .mockResolvedValue();
      jest
        .spyOn(productsRepository, 'createProductOptionGroup')
        .mockResolvedValue();
      jest.spyOn(productsRepository, 'createProductImage').mockResolvedValue();
      jest.spyOn(productsRepository, 'createProductTag').mockResolvedValue();

      const create = await productsService.create(productPackage);

      expect(productsRepository.createProduct).toHaveBeenCalledWith(newProduct);
      expect(productsRepository.createProduct).toHaveBeenCalledTimes(1);

      expect(productsRepository.createProductDetail).toHaveBeenCalledWith(
        product.id,
        newProductDetail,
      );
      expect(productsRepository.createProductDetail).toHaveBeenCalledTimes(1);

      expect(productsRepository.createProductPrice).toHaveBeenCalledWith(
        product.id,
        newProductPrice,
      );
      expect(productsRepository.createProductPrice).toHaveBeenCalledTimes(1);

      expect(productsRepository.createProductCategory).toHaveBeenCalledWith(
        product.id,
        newProductCategories,
      );
      expect(productsRepository.createProductCategory).toHaveBeenCalledTimes(1);

      expect(productsRepository.createProductOptionGroup).toHaveBeenCalledWith(
        product.id,
        newProductOptionGroups,
      );
      expect(productsRepository.createProductOptionGroup).toHaveBeenCalledTimes(
        1,
      );

      expect(productsRepository.createProductImage).toHaveBeenCalledWith(
        product.id,
        newProductImages,
      );
      expect(productsRepository.createProductImage).toHaveBeenCalledTimes(1);

      expect(productsRepository.createProductTag).toHaveBeenCalledWith(
        product.id,
        newProductTags,
      );
      expect(productsRepository.createProductTag).toHaveBeenCalledTimes(1);

      expect(create).toEqual({
        success: true,
        data: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          created_at: product.createdAt,
          updated_at: product.updatedAt,
        },
        message: '상품이 성공적으로 등록되었습니다.',
      });
    });

    it('[상품 생성] create Already Error', async () => {
      const product = new Product();
      Object.assign(product, {
        id: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        name: 'test',
        slug: 'test-slug',
        shortDescription: 'test-short-description',
        fullDescription: 'test-full-description',
        sellerId: '304df7f7-04cc-4760-9f62-47669a19f149',
        brandId: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
        status: STATUS.ProductStatus.SOLDOUT,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newProduct: CreateProductDto = {
        name: 'test',
        slug: 'test-slug',
        shortDescription: 'test-short-description',
        fullDescription: 'test-full-escription',
        status: STATUS.ProductStatus.SOLDOUT,
        sellerId: '304df7f7-04cc-4760-9f62-47669a19f149',
        brandId: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
      };

      const productPackage: CreateProductPackageDto = {
        product: newProduct,
        productDetail: null,
        productPrice: null,
        productCategories: null,
        productOptionGroups: null,
        productImages: null,
        productTags: null,
      };

      jest
        .spyOn(productsRepository, 'findOneUniqueSlug')
        .mockResolvedValue(product);

      try {
        await productsService.create(productPackage);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect((err as HttpException).getResponse()).toBe(
          'Already Product Slug',
        );
      }
    });
  });

  describe('[상품 목록 전체 조회] find Method', () => {
    it('[상품 목록 전체 조회] find Success', async () => {
      const productRequestDto = new ProductRequestDto();
      Object.assign(productRequestDto, {
        sort: 'ASC',
        status: STATUS.ProductStatus.SOLDOUT,
        minPrice: 1000,
        maxPrice: 1000,
        category: [
          'ce26d2d3-2a8d-4658-9225-98b2018f48f8',
          '7c74562a-62cb-4cd5-9e3e-67186d8aa16d',
        ],
        seller: '304df7f7-04cc-4760-9f62-47669a19f149',
        brand: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
        inStock: true,
        search: 'test',
      });

      const products = [
        {
          id: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
          name: 'test',
          slug: 'test-slug',
          short_description: 'test-short-description',
          base_price: 1000,
          sale_price: 1000,
          currency: 'KRW',
          primary_image: [
            {
              url: 'http://test.com',
              alt_text: 'test-text',
            },
            {
              url: 'http://test1.com',
              alt_text: 'test-text-1',
            },
          ],
          brand: {
            id: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
            name: 'test-brand-1',
          },
          seller: {
            id: '304df7f7-04cc-4760-9f62-47669a19f149',
            name: 'test-seller-1',
          },
          rating: 0,
          review_count: 0,
          in_stock: true,
          status: STATUS.ProductStatus.SOLDOUT,
          created_at: new Date(),
        },
        {
          id: '878d0491-8d65-48fb-8a27-4353923ad755',
          name: 'test-1',
          slug: 'test-slug-1',
          short_description: 'test-short-description-1',
          base_price: 1001,
          sale_price: 1001,
          currency: 'KRW',
          primary_image: [
            {
              url: 'http://test2.com',
              alt_text: 'test-text-2',
            },
            {
              url: 'http://test3.com',
              alt_text: 'test-text-3',
            },
          ],
          brand: {
            id: '82971386-1f07-47ab-9b07-1e62a1e862e6',
            name: 'test-brand-2',
          },
          seller: {
            id: '245685e6-596a-4514-a21e-0a0b12ea2ed9',
            name: 'test-seller-2',
          },
          rating: 0,
          review_count: 0,
          in_stock: true,
          status: STATUS.ProductStatus.SOLDOUT,
          created_at: new Date(),
        },
      ];

      jest.spyOn(productsRepository, 'find').mockResolvedValue(products);

      const find = await productsService.find(productRequestDto);

      expect(productsRepository.find).toHaveBeenCalledWith(productRequestDto);
      expect(productsRepository.find).toHaveBeenCalledTimes(1);

      expect(find).toEqual({
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
      });
    });
  });

  describe('[상품 목록 상세 조회] findOne Method', () => {
    it('[상품 목록 상세 조회] findOne Success', async () => {
      const productId = '5affd8e7-4490-4562-b549-cc5cbfe0c4ca';
      const product = {
        id: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        name: 'test',
        slug: 'test-slug',
        short_description: 'test-short-description',
        full_description: 'test-full-description',
        seller: {
          id: '304df7f7-04cc-4760-9f62-47669a19f149',
          name: 'test-seller-1',
          description: 'test',
          logo_url: 'http://sellerimg.com',
          rating: 0,
          contact_email: 'test@naver.com',
          contact_phone: '010-0000-0000',
        },
        brand: {
          id: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
          name: 'test-brand-1',
          description: 'test',
          logo_url: 'http://brandimg.com',
          website: 'http://brand.com',
        },
        status: STATUS.ProductStatus.SOLDOUT,
        created_at: new Date(),
        updated_at: new Date(),
        detail: {
          weight: 100,
          dimensions: {
            width: 100,
            height: 100,
            depth: 100,
          },
          materials: 'test-material',
          country_of_origin: 'test-contry',
          warranty_info: 'test-warranty',
          care_instructions: 'test-care',
          additional_info: {
            assembly_required: 1,
            assembly_time: 30,
          },
        },
        price: {
          base_price: 1000,
          sale_price: 1000,
          currency: 'KRW',
          tax_rate: 10,
          discount_percentage: 10,
        },
        categories: [
          {
            id: 'ce26d2d3-2a8d-4658-9225-98b2018f48f8',
            name: 'test-category-1',
            slug: 'test-slug-1',
            is_primary: false,
            parent: {
              id: '3202f637-a911-42d5-87a1-aca27bdbca09',
              name: 'test-category-3',
              slug: 'test-slug-3',
            },
          },
          {
            id: '7c74562a-62cb-4cd5-9e3e-67186d8aa16d',
            name: 'test-category-2',
            slug: 'test-slug-2',
            is_primary: false,
            parent: {
              id: 'c0983ef8-ef2e-4995-9c0f-5a3c29388f8e',
              name: 'test-category-4',
              slug: 'test-slug-4',
            },
          },
        ],
        option_groups: [
          {
            id: '2d53d228-c549-4477-9a67-3c2590af2b20',
            name: 'test-1',
            display_order: 1,
            options: [
              {
                id: '76aa0e8c-014c-4217-86fa-a00478e2f07c',
                name: 'test-option-1',
                additional_price: 1000,
                sku: 'test-1',
                stock: 10,
                display_order: 1,
              },
              {
                id: '369d45ac-8e44-4154-9783-a6ea53654871',
                name: 'test-option-2',
                additional_price: 1001,
                sku: 'test-2',
                stock: 11,
                display_order: 2,
              },
            ],
          },
          {
            id: '4efaaed8-4d04-4109-a8d6-d28a8e90d9f9',
            name: 'test-2',
            display_order: 2,
            options: [
              {
                id: '9782dc90-d236-4ed4-aece-e0120eee3d51',
                name: 'test-option-3',
                additional_price: 1002,
                sku: 'test-3',
                stock: 12,
                display_order: 3,
              },
              {
                id: '826818ca-0aa7-46ac-99d5-7fc4595676e2',
                name: 'test-option-4',
                additional_price: 1003,
                sku: 'test-4',
                stock: 13,
                display_order: 4,
              },
            ],
          },
        ],
        images: [
          {
            id: '13f08f17-4e83-4533-950a-fd01f9261219',
            url: 'http://img.com',
            alt_text: 'test-alt',
            is_primary: false,
            display_order: 1,
            option_id: '76aa0e8c-014c-4217-86fa-a00478e2f07c',
          },
          {
            id: 'bcaa7d98-1db0-463c-960d-cc03456a5752',
            url: 'http://img1.com',
            alt_text: 'test-alt-1',
            is_primary: false,
            display_order: 2,
            option_id: '369d45ac-8e44-4154-9783-a6ea53654871',
          },
        ],
        tags: [
          {
            id: 'fc59b618-0c2f-415c-bf58-bec3f43233e2',
            name: 'test-tag',
            slug: 'test-slug',
          },
          {
            id: '2e9c8929-ca8d-47dd-b718-805dcd249bbb',
            name: 'test-tag-1',
            slug: 'test-slug-1',
          },
        ],
        rating: {
          average: 0,
          count: 0,
          distribution: {
            5: 5,
            4: 4,
            3: 3,
            2: 2,
            1: 1,
          },
        },
        related_products: [
          {
            id: '3ea96f83-cc8c-4500-83c6-3cca2499cf38',
            name: 'test-11',
            slug: 'test-related1-slug',
            short_description: 'test-short-description',
            primary_image: [
              {
                url: 'https://test1.com',
                alt_text: 'test-alt-1',
              },
              {
                url: 'https://test1.com',
                alt_text: 'test-alt-1',
              },
            ],
            base_price: 1000,
            sale_price: 1000,
            currency: 'KRW',
          },
          {
            id: '340dd4b1-f14d-48fe-9ed3-c8f3e6c32eec',
            name: 'test-12',
            slug: 'test-related2-slug',
            short_description: 'test-short-description',
            primary_image: [
              {
                url: 'https://test2.com',
                alt_text: 'test-alt-2',
              },
              {
                url: 'https://test2.com',
                alt_text: 'test-alt-2',
              },
            ],
            base_price: 1001,
            sale_price: 1001,
            currency: 'KRW',
          },
        ],
      };

      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(product);

      const findOne = await productsService.findOne(productId);

      expect(productsRepository.findOne).toHaveBeenCalledWith(productId);
      expect(productsRepository.findOne).toHaveBeenCalledTimes(1);

      expect(findOne).toEqual({
        success: true,
        data: product,
        message: '상품 상세 정보를 성공적으로 조회했습니다.',
      });
    });
  });
});
