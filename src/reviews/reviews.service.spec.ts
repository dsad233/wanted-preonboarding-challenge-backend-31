import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { TestBed } from '@automock/jest';

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ReviewsService).compile();

    reviewsService = unit;
  });

  it('should be defined', () => {
    expect(reviewsService).toBeDefined();
  });
});
