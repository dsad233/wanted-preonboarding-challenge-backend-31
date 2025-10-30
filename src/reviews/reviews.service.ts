import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProductReviewDto } from 'src/products/dto/updateProductDto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private reviewsRepository: ReviewsRepository) {}

  // 상품 리뷰 수정
  async update(
    id: string,
    userId: string,
    updateProductReviewDto: UpdateProductReviewDto,
  ): Promise<object> {
    const review = await this.reviewsRepository.findByReviewId(id);

    if (review.userId !== userId) {
      throw new HttpException(
        '다른 사용자의 리뷰를 수정할 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    const newReview = await this.reviewsRepository.updateProductReview(
      id,
      updateProductReviewDto,
    );

    return {
      success: true,
      data: {
        id: newReview.id,
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
        updated_at: newReview.updatedAt,
      },
      message: '리뷰가 성공적으로 수정되었습니다.',
    };
  }

  // 상품 리뷰 삭제
  async delete(id: string, userId: string): Promise<object> {
    const review = await this.reviewsRepository.findByReviewId(id);

    if (review.userId !== userId) {
      throw new HttpException(
        '다른 사용자의 리뷰를 수정할 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.reviewsRepository.deleteProductReview(id);

    return {
      success: true,
      message: '리뷰가 성공적으로 삭제되었습니다.',
    };
  }
}
