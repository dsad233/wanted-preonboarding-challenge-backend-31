import { BaseRepository } from '@libs/database';
import { ProductOption } from '@libs/database/entities';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateProductOptionDto } from 'src/products/dto/createProductDto';
import { UpdateProductOption } from 'src/products/dto/updateProductDto';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ProductOptionsRepository extends BaseRepository {
  constructor(
    @InjectDataSource('default') defaultDataSource: DataSource,
    @Inject(REQUEST) request: Request,
  ) {
    super(defaultDataSource, request);
  }

  // 상품 옵션 추가
  async createProductOption(createProductOptionDto: CreateProductOptionDto) {
    const option = this.getRepository(ProductOption).create({
      ...createProductOptionDto,
    });

    return await this.getRepository(ProductOption).save(option);
  }

  // 상품 옵션 수정
  async updateProductOption(
    id: string,
    updateProductOption: UpdateProductOption,
  ) {
    const option = await this.getRepository(ProductOption).findOne({
      where: { id: id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!option) {
      throw new HttpException('RESOURCE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const merge = this.getRepository(ProductOption).merge(
      option,
      updateProductOption,
    );

    return await this.getRepository(ProductOption).save(merge);
  }

  // 상품 옵션 삭제
  async deleteProductOption(id: string) {
    await this.getRepository(ProductOption).delete(id);
  }
}
