import { BaseRepository } from '@libs/database';
import { Review } from '@libs/database/entities';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { UpdateProductReviewDto } from 'src/products/dto/updateProductDto';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ReviewsRepository extends BaseRepository {
  constructor(
    @InjectDataSource('default') defaultDataSource: DataSource,
    @Inject(REQUEST) request: Request,
  ) {
    super(defaultDataSource, request);
  }

  // 상품 리뷰 수정
  async updateProductReview(
    id: string,
    updateProductReviewDto: UpdateProductReviewDto,
  ) {
    const review = await this.getRepository(Review).findOne({
      where: { id: id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!review) {
      throw new HttpException('RESOURCE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const merge = this.getRepository(Review).merge(
      review,
      updateProductReviewDto,
    );

    return await this.getRepository(Review).save(merge);
  }

  // 상품 리뷰 삭제
  async deleteProductReview(id: string) {
    await this.getRepository(Review).delete({ id: id });
  }
}
