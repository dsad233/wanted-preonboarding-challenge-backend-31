import { ProductOption } from '@libs/database/entities';
import { ProductOptionsRepository } from './product-options.repository';
import { ProductOptionsService } from './product-options.service';
import { TestBed } from '@automock/jest';
import { CreateProductOptionDto } from 'src/products/dto/createProductDto';

describe('ProductOptionsService', () => {
  let productOptionsService: ProductOptionsService;
  let productOptionsRepository: jest.Mocked<ProductOptionsRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductOptionsService).compile();

    productOptionsService = unit;
    productOptionsRepository = unitRef.get(ProductOptionsRepository);

    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  describe('[상품 옵션 추가] create Method', () => {
    it('[상품 옵션 추가] create Success', async () => {
      const createProductOptionDto: CreateProductOptionDto = {
        name: 'test-option',
        additionalPrice: 1000,
        sku: 'test-code',
        stock: 0,
        displayOrder: 1,
      };

      const productOption = new ProductOption();
      Object.assign(productOption, {
        id: '1a5c4330-7182-4491-984d-6523f51ba160',
        optionGroupId: '60a25cf4-268d-4596-87c9-b1c3fbc396a3',
        name: 'test-option',
        additionalPrice: 1000,
        sku: 'test-code',
        stock: 0,
        displayOrder: 1,
      });

      jest
        .spyOn(productOptionsRepository, 'createProductOption')
        .mockResolvedValue(productOption);

      const create = await productOptionsService.create(createProductOptionDto);

      expect(
        productOptionsRepository.createProductOption,
      ).toHaveBeenLastCalledWith(createProductOptionDto);
      expect(
        productOptionsRepository.createProductOption,
      ).toHaveBeenCalledTimes(1);

      expect(create).toEqual({
        success: true,
        data: {
          id: productOption.id,
          option_group_id: productOption.optionGroupId,
          name: productOption.name,
          additional_price: productOption.additionalPrice,
          sku: productOption.sku,
          stock: productOption.stock,
          display_order: productOption.displayOrder,
        },
        message: '상품 옵션이 성공적으로 추가되었습니다.',
      });
    });

    describe('[상품 옵션 정보 수정] update Method', () => {
      it('[상품 옵션 정보 수정] update Success', async () => {
        const productOptionId = 'bb2ba2b3-91f6-46fa-a6a4-fd4a08c204b5';
        const productOption = new ProductOption();
        Object.assign(productOption, {
          id: 'bb2ba2b3-91f6-46fa-a6a4-fd4a08c204b5',
          optionGroupId: '60a25cf4-268d-4596-87c9-b1c3fbc396a3',
          name: 'test-option',
          additionalPrice: 1000,
          sku: 'test-code',
          stock: 0,
          displayOrder: 1,
        });

        jest
          .spyOn(productOptionsRepository, 'updateProductOption')
          .mockResolvedValue(productOption);

        const update = await productOptionsService.update(
          productOptionId,
          productOption,
        );

        expect(
          productOptionsRepository.updateProductOption,
        ).toHaveBeenCalledWith(productOptionId, productOption);
        expect(
          productOptionsRepository.updateProductOption,
        ).toHaveBeenCalledTimes(1);

        expect(update).toEqual({
          success: true,
          data: {
            id: productOption.id,
            name: productOption.name,
            option_group_id: productOption.optionGroupId,
            additional_price: productOption.additionalPrice,
            sku: productOption.sku,
            stock: productOption.stock,
            display_order: productOption.displayOrder,
          },
          message: '상품 옵션이 성공적으로 수정되었습니다.',
        });
      });

      describe('[상품 옵션 삭제] delete Method', () => {
        it('[상품 옵션 삭제] delete Success', async () => {
          const productOptionId = 'bb2ba2b3-91f6-46fa-a6a4-fd4a08c204b5';

          jest
            .spyOn(productOptionsRepository, 'deleteProductOption')
            .mockResolvedValue();

          const remove = await productOptionsService.delete(productOptionId);

          expect(
            productOptionsRepository.deleteProductOption,
          ).toHaveBeenCalledWith(productOptionId);
          expect(
            productOptionsRepository.deleteProductOption,
          ).toHaveBeenCalledTimes(1);

          expect(remove).toEqual({
            success: true,
            message: '상품 옵션이 성공적으로 삭제되었습니다.',
          });
        });
      });
    });
  });
});
