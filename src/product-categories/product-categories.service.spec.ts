import { ProductCategoriesService } from './product-categories.service';
import { TestBed } from '@automock/jest';
import { ProductCategoriesRepository } from './product-categories.repository';
import { ProductCategoryRequestDto } from './dto/productCategoryRequestDto';
import { RedisRepository } from '../redis/redis.repository';
import { TYPE } from '@libs/enums';

describe('ProductCategoriesService', () => {
  let productCategoriesService: ProductCategoriesService;
  let productCategoriesRepository: jest.Mocked<ProductCategoriesRepository>;
  let redisRepository: jest.Mocked<RedisRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      ProductCategoriesService,
    ).compile();

    productCategoriesService = unit;
    productCategoriesRepository = unitRef.get(ProductCategoriesRepository);
    redisRepository = unitRef.get(RedisRepository);

    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  describe('[카테고리 목록 조회] find Method', () => {
    it('[카테고리 목록 조회] Cache find Success', async () => {
      const level = 1;
      const categories = [
        {
          id: '99101754-77ba-470c-b2ca-c79408008143',
          name: 'test1',
          slug: 'test-slug',
          description: 'test',
          level: 1,
          parentId: null,
          imageUrl: 'http://test.com',
          children: [
            {
              id: '7688aff6-e1e9-4ac4-aaff-cb400e1d077d',
              name: 'test-11',
              slug: 'test-slug-1',
              description: 'test11',
              parentId: '99101754-77ba-470c-b2ca-c79408008143',
              level: 2,
              imageUrl: 'http://test11.com',
            },
          ],
        },
        {
          id: '3e265676-7524-4d84-a87f-7ef484e49cf7',
          name: 'test2',
          slug: 'test-slug2',
          description: 'test2',
          parentId: null,
          level: 1,
          imageUrl: 'http://test2.com',
        },
      ];

      jest
        .spyOn(redisRepository, 'get')
        .mockResolvedValue(JSON.stringify(categories));

      const find = await productCategoriesService.find(level);

      expect(redisRepository.get).toHaveBeenCalledWith(
        `${TYPE.PrefixType.CATEGORIES}:level=${level}`,
      );
      expect(redisRepository.get).toHaveBeenCalledTimes(1);

      expect(find).toEqual({
        success: true,
        data: JSON.parse(JSON.stringify(categories)),
        message: '카테고리 목록을 성공적으로 조회했습니다.',
      });
    });

    it('[카테고리 목록 조회] Default find Success', async () => {
      const level = 1;
      const categories = [
        {
          id: '99101754-77ba-470c-b2ca-c79408008143',
          name: 'test1',
          slug: 'test-slug',
          description: 'test',
          level: 1,
          parentId: null,
          imageUrl: 'http://test.com',
          children: [
            {
              id: '7688aff6-e1e9-4ac4-aaff-cb400e1d077d',
              name: 'test-11',
              slug: 'test-slug-1',
              description: 'test11',
              parentId: '99101754-77ba-470c-b2ca-c79408008143',
              level: 2,
              imageUrl: 'http://test11.com',
            },
          ],
        },
        {
          id: '3e265676-7524-4d84-a87f-7ef484e49cf7',
          name: 'test2',
          slug: 'test-slug2',
          description: 'test2',
          parentId: null,
          level: 1,
          imageUrl: 'http://test2.com',
        },
      ];

      jest.spyOn(redisRepository, 'get').mockResolvedValue(undefined);
      jest
        .spyOn(productCategoriesRepository, 'find')
        .mockResolvedValue(categories);
      jest.spyOn(redisRepository, 'setex').mockResolvedValue();

      const find = await productCategoriesService.find(level);

      expect(redisRepository.get).toHaveBeenCalledWith(
        `${TYPE.PrefixType.CATEGORIES}:level=${level}`,
      );
      expect(redisRepository.get).toHaveBeenCalledTimes(1);

      expect(productCategoriesRepository.find).toHaveBeenCalledWith(level);
      expect(productCategoriesRepository.find).toHaveBeenCalledTimes(1);

      expect(redisRepository.setex).toHaveBeenCalledWith(
        `${TYPE.PrefixType.CATEGORIES}:level=${level}`,
        120000,
        JSON.stringify(categories),
      );
      expect(redisRepository.setex).toHaveBeenCalledTimes(1);

      expect(find).toEqual({
        success: true,
        data: categories,
        message: '카테고리 목록을 성공적으로 조회했습니다.',
      });
    });

    describe('[특정 카테고리의 상품 목록 조회] findOne Method', () => {
      it('[특정 카테고리의 상품 목록 조회] Cache findOne Success', async () => {
        const categoryId = '99101754-77ba-470c-b2ca-c79408008143';
        const productCategoryRequestDto = new ProductCategoryRequestDto();
        Object.assign(productCategoryRequestDto, {
          sort: 'ASC',
          includeSubcategories: true,
        });

        const category = {
          category: {
            id: '99101754-77ba-470c-b2ca-c79408008143',
            name: 'test1',
            slug: 'test-slug',
            description: 'test',
            level: 1,
            image_url: 'http://test.com',
            parent: {
              id: '2ec1758a-7074-47c3-8d74-fc6af4cc12e6',
              name: 'test1',
              slug: 'test-slug-2',
            },
          },
          item: [
            {
              id: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
              name: 'test',
              slug: 'test-slug-item',
              short_description: 'test-short-description',
              base_price: '1000',
              sale_price: '10000',
              currency: 'KRW',
              seller: {
                id: '304df7f7-04cc-4760-9f62-47669a19f149',
                name: 'test-seller',
              },
              brand: {
                id: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
                name: 'test-brand',
              },
              rating: 0,
              review_count: 0,
              status: 'SOLD_OUT',
              created_at: new Date(),
            },
          ],
          pagination: {
            total_items: 10,
            total_pages: Math.ceil(10 / productCategoryRequestDto.getTake()),
            current_page: productCategoryRequestDto.getPage(),
            per_page: productCategoryRequestDto.getTake(),
          },
        };

        jest
          .spyOn(redisRepository, 'get')
          .mockResolvedValue(JSON.stringify(category));

        const findOne = await productCategoriesService.findOne(
          categoryId,
          productCategoryRequestDto,
        );

        expect(redisRepository.get).toHaveBeenCalledWith(
          `${TYPE.PrefixType.CATEGORY}:page=${productCategoryRequestDto.getPage()}:pages=${productCategoryRequestDto.getTake()}:includeSubcategories=${productCategoryRequestDto.includeSubcategories}`,
        );
        expect(redisRepository.get).toHaveBeenCalledTimes(1);

        expect(findOne).toEqual({
          success: true,
          data: JSON.parse(JSON.stringify(category)),
          message: '카테고리 상품 목록을 성공적으로 조회했습니다.',
        });
      });

      it('[특정 카테고리의 상품 목록 조회] Default findOne Success', async () => {
        const categoryId = '99101754-77ba-470c-b2ca-c79408008143';
        const productCategoryRequestDto = new ProductCategoryRequestDto();
        Object.assign(productCategoryRequestDto, {
          sort: 'ASC',
          includeSubcategories: true,
        });

        const category = {
          category: {
            id: '99101754-77ba-470c-b2ca-c79408008143',
            name: 'test1',
            slug: 'test-slug',
            description: 'test',
            level: 1,
            image_url: 'http://test.com',
            parent: {
              id: '2ec1758a-7074-47c3-8d74-fc6af4cc12e6',
              name: 'test1',
              slug: 'test-slug-2',
            },
          },
          item: [
            {
              id: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
              name: 'test',
              slug: 'test-slug-item',
              short_description: 'test-short-description',
              base_price: '1000',
              sale_price: '10000',
              currency: 'KRW',
              seller: {
                id: '304df7f7-04cc-4760-9f62-47669a19f149',
                name: 'test-seller',
              },
              brand: {
                id: '1470a36f-14b4-447e-b1bd-5cfed56389ab',
                name: 'test-brand',
              },
              rating: 0,
              review_count: 0,
              status: 'SOLD_OUT',
              created_at: new Date(),
            },
          ],
          pagination: {
            total_items: 10,
            total_pages: Math.ceil(10 / productCategoryRequestDto.getTake()),
            current_page: productCategoryRequestDto.getPage(),
            per_page: productCategoryRequestDto.getTake(),
          },
        };

        jest.spyOn(redisRepository, 'get').mockResolvedValue(undefined);
        jest
          .spyOn(productCategoriesRepository, 'findOneCategoryAndProduct')
          .mockResolvedValue(category);
        jest.spyOn(redisRepository, 'setex').mockResolvedValue();

        const findOne = await productCategoriesService.findOne(
          categoryId,
          productCategoryRequestDto,
        );

        expect(redisRepository.get).toHaveBeenCalledWith(
          `${TYPE.PrefixType.CATEGORY}:page=${productCategoryRequestDto.getPage()}:pages=${productCategoryRequestDto.getTake()}:includeSubcategories=${productCategoryRequestDto.includeSubcategories}`,
        );
        expect(redisRepository.get).toHaveBeenCalledTimes(1);

        expect(
          productCategoriesRepository.findOneCategoryAndProduct,
        ).toHaveBeenCalledWith(categoryId, productCategoryRequestDto);
        expect(
          productCategoriesRepository.findOneCategoryAndProduct,
        ).toHaveBeenCalledTimes(1);

        expect(redisRepository.setex).toHaveBeenCalledWith(
          `${TYPE.PrefixType.CATEGORY}:page=${productCategoryRequestDto.getPage()}:pages=${productCategoryRequestDto.getTake()}:includeSubcategories=${productCategoryRequestDto.includeSubcategories}`,
          300000,
          JSON.stringify(category),
        );
        expect(redisRepository.setex).toHaveBeenCalledTimes(1);

        expect(findOne).toEqual({
          success: true,
          data: category,
          message: '카테고리 상품 목록을 성공적으로 조회했습니다.',
        });
      });
    });
  });
});
