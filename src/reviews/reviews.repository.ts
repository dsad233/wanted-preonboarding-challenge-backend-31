import { BaseRepository } from '@libs/database';
import { Review } from '@libs/database/entities';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { UpdateProductReviewDto } from 'src/products/dto/updateProductDto';
import { DataSource } from 'typeorm';

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
