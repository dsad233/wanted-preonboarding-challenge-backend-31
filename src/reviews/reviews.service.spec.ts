import { ReviewsService } from './reviews.service';
import { TestBed } from '@automock/jest';
import { ReviewsRepository } from './reviews.repository';
import { Review } from '@libs/database/entities';
import { UpdateProductReviewDto } from 'src/products/dto/updateProductDto';

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let reviewsRepository: jest.Mocked<ReviewsRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ReviewsService).compile();

    reviewsService = unit;
    reviewsRepository = unitRef.get(ReviewsRepository);

    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  describe('[상품 리뷰 수정] update Method', () => {
    it('[상품 리뷰 수정] update Success', async () => {
      const reviewId = 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027';
      const updateProductReviewDto: UpdateProductReviewDto = {
        rating: 0,
        title: 'review-title',
        content: 'review-content',
      };
      const review = new Review();
      Object.assign(review, {
        id: 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027',
        userId: '64aaf4bd-293b-43dd-8f87-a95d81a062e9',
        rating: 0,
        productId: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        title: 'review-title',
        content: 'review-content',
        helpfulVotes: 0,
        verifiedPurchase: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest
        .spyOn(reviewsRepository, 'updateProductReview')
        .mockResolvedValue(review);

      const update = await reviewsService.update(
        reviewId,
        updateProductReviewDto,
      );

      expect(reviewsRepository.updateProductReview).toHaveBeenCalledWith(
        reviewId,
        updateProductReviewDto,
      );
      expect(reviewsRepository.updateProductReview).toHaveBeenCalledTimes(1);

      expect(update).toEqual({
        success: true,
        data: {
          id: review.id,
          rating: review.rating,
          title: review.title,
          content: review.content,
          updated_at: review.updatedAt,
        },
        message: '리뷰가 성공적으로 수정되었습니다.',
      });
    });
  });

  describe('[상품 리뷰 삭제] delete Method', () => {
    it('[상품 리뷰 삭제] delete Success', async () => {
      const reviewId = 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027';

      jest.spyOn(reviewsRepository, 'deleteProductReview').mockResolvedValue();

      const remove = await reviewsService.delete(reviewId);

      expect(reviewsRepository.deleteProductReview).toHaveBeenCalledWith(
        reviewId,
      );
      expect(reviewsRepository.deleteProductReview).toHaveBeenCalledTimes(1);

      expect(remove).toEqual({
        success: true,
        message: '리뷰가 성공적으로 삭제되었습니다.',
      });
    });
  });
});
