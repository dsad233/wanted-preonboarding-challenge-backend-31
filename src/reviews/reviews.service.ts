import { Injectable } from '@nestjs/common';
import { UpdateProductReviewDto } from 'src/products/dto/updateProductDto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private reviewsRepository: ReviewsRepository) {}

  // 상품 리뷰 수정
  async update(
    id: string,
    updateProductReviewDto: UpdateProductReviewDto,
  ): Promise<object> {
    const review = await this.reviewsRepository.updateProductReview(
      id,
      updateProductReviewDto,
    );

    return {
      success: true,
      data: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        updated_at: review.updatedAt,
      },
      message: '리뷰가 성공적으로 수정되었습니다.',
    };
  }

  // 상품 리뷰 삭제
  async delete(id: string): Promise<object> {
    await this.reviewsRepository.deleteProductReview(id);

    return {
      success: true,
      message: '리뷰가 성공적으로 삭제되었습니다.',
    };
  }
}
