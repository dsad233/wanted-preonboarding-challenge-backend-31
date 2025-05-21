import { Injectable } from '@nestjs/common';
import { ProductOptionsRepository } from './product-options.repository';
import { CreateProductOptionDto } from 'src/products/dto/createProductDto';
import { UpdateProductOption } from 'src/products/dto/updateProductDto';

@Injectable()
export class ProductOptionsService {
  constructor(private productOptionsRepository: ProductOptionsRepository) {}

  // 상품 옵션 추가
  async create(createProductOptionDto: CreateProductOptionDto) {
    const option = await this.productOptionsRepository.createProductOption(
      createProductOptionDto,
    );

    return {
      success: true,
      data: {
        id: option.id,
        option_group_id: option.optionGroupId,
        name: option.name,
        additional_price: option.additionalPrice,
        sku: option.sku,
        stock: option.stock,
        display_order: option.displayOrder,
      },
      message: '상품 옵션이 성공적으로 추가되었습니다.',
    };
  }

  // 상품 옵션 정보 수정
  async update(id: string, updateProductOption: UpdateProductOption) {
    const option = await this.productOptionsRepository.updateProductOption(
      id,
      updateProductOption,
    );

    return {
      success: true,
      data: {
        id: option.id,
        name: option.name,
        additional_price: option.additionalPrice,
        sku: option.sku,
        stock: option.stock,
        display_order: option.displayOrder,
      },
      message: '상품 옵션이 성공적으로 수정되었습니다.',
    };
  }

  // 상품 옵션 삭제
  async delete(id: string) {
    await this.productOptionsRepository.deleteProductOption(id);
    return {
      success: true,
      message: '상품 옵션이 성공적으로 삭제되었습니다.',
    };
  }
}
