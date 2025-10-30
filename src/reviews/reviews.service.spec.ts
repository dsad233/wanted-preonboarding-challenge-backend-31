import { ReviewsService } from './reviews.service';
import { TestBed } from '@automock/jest';
import { ReviewsRepository } from './reviews.repository';
import { Review } from '@libs/database/entities';
import { UpdateProductReviewDto } from 'src/products/dto/updateProductDto';
import { HttpException, HttpStatus } from '@nestjs/common';

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
      const userId = '64aaf4bd-293b-43dd-8f87-a95d81a062e9';
      const updateProductReviewDto: UpdateProductReviewDto = {
        rating: 0,
        title: 'review-title',
        content: 'review-content',
      };

      const review = new Review();
      Object.assign(review, {
        id: 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027',
        userId: '64aaf4bd-293b-43dd-8f87-a95d81a062e9',
        rating: 1,
        productId: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        title: 'review',
        content: 'review',
        helpfulVotes: 0,
        verifiedPurchase: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newReview = new Review();
      Object.assign(newReview, {
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

      jest.spyOn(reviewsRepository, 'findByReviewId').mockResolvedValue(review);
      jest
        .spyOn(reviewsRepository, 'updateProductReview')
        .mockResolvedValue(newReview);

      const update = await reviewsService.update(
        reviewId,
        userId,
        updateProductReviewDto,
      );

      expect(reviewsRepository.findByReviewId).toHaveBeenCalledWith(reviewId);
      expect(reviewsRepository.findByReviewId).toHaveBeenCalledTimes(1);

      expect(reviewsRepository.updateProductReview).toHaveBeenCalledWith(
        reviewId,
        updateProductReviewDto,
      );
      expect(reviewsRepository.updateProductReview).toHaveBeenCalledTimes(1);

      expect(update).toEqual({
        success: true,
        data: {
          id: newReview.id,
          rating: newReview.rating,
          title: newReview.title,
          content: newReview.content,
          updated_at: newReview.updatedAt,
        },
        message: '리뷰가 성공적으로 수정되었습니다.',
      });
    });

    it('[상품 리뷰 수정] update forbidden Error', async () => {
      const reviewId = 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027';
      const userId = '73ec8267-ab26-4412-a53e-eedd48b5937d';
      const updateProductReviewDto: UpdateProductReviewDto = {
        rating: 0,
        title: 'review-title',
        content: 'review-content',
      };

      const review = new Review();
      Object.assign(review, {
        id: 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027',
        userId: '64aaf4bd-293b-43dd-8f87-a95d81a062e9',
        rating: 1,
        productId: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        title: 'review',
        content: 'review',
        helpfulVotes: 0,
        verifiedPurchase: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(reviewsRepository, 'findByReviewId').mockResolvedValue(review);

      try {
        await reviewsService.update(reviewId, userId, updateProductReviewDto);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect((err as HttpException).getResponse()).toBe(
          '다른 사용자의 리뷰를 수정할 권한이 없습니다.',
        );
      }
    });
  });

  describe('[상품 리뷰 삭제] delete Method', () => {
    it('[상품 리뷰 삭제] delete Success', async () => {
      const reviewId = 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027';
      const userId = '64aaf4bd-293b-43dd-8f87-a95d81a062e9';

      const review = new Review();
      Object.assign(review, {
        id: 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027',
        userId: '64aaf4bd-293b-43dd-8f87-a95d81a062e9',
        rating: 1,
        productId: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        title: 'review',
        content: 'review',
        helpfulVotes: 0,
        verifiedPurchase: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(reviewsRepository, 'findByReviewId').mockResolvedValue(review);
      jest.spyOn(reviewsRepository, 'deleteProductReview').mockResolvedValue();

      const remove = await reviewsService.delete(reviewId, userId);

      expect(reviewsRepository.findByReviewId).toHaveBeenCalledWith(reviewId);
      expect(reviewsRepository.findByReviewId).toHaveBeenCalledTimes(1);

      expect(reviewsRepository.deleteProductReview).toHaveBeenCalledWith(
        reviewId,
      );
      expect(reviewsRepository.deleteProductReview).toHaveBeenCalledTimes(1);

      expect(remove).toEqual({
        success: true,
        message: '리뷰가 성공적으로 삭제되었습니다.',
      });
    });

    it('[상품 리뷰 삭제] delete forbidden Error', async () => {
      const reviewId = 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027';
      const userId = '64aaf4bd-293b-43dd-8f87-a95d81a062e9';

      const review = new Review();
      Object.assign(review, {
        id: 'dbd0e4f1-26a1-497c-aa25-ca092c9b1027',
        userId: '64aaf4bd-293b-43dd-8f87-a95d81a062e9',
        rating: 1,
        productId: '5affd8e7-4490-4562-b549-cc5cbfe0c4ca',
        title: 'review',
        content: 'review',
        helpfulVotes: 0,
        verifiedPurchase: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(reviewsRepository, 'findByReviewId').mockResolvedValue(review);

      try {
        await reviewsService.delete(reviewId, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect((err as HttpException).getResponse()).toBe(
          '다른 사용자의 리뷰를 수정할 권한이 없습니다.',
        );
      }
    });
  });
});
