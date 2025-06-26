import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoriesService } from './product-categories.service';
import { TestBed } from '@automock/jest';

describe('ProductCategoriesService', () => {
  let productCategoriesService: ProductCategoriesService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(
      ProductCategoriesService,
    ).compile();

    productCategoriesService = unit;
  });

  it('should be defined', () => {
    expect(productCategoriesService).toBeDefined();
  });
});
