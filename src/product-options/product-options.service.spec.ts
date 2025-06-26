import { Test, TestingModule } from '@nestjs/testing';
import { ProductOptionsService } from './product-options.service';
import { TestBed } from '@automock/jest';

describe('ProductOptionsService', () => {
  let productOptionsService: ProductOptionsService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductOptionsService).compile();

    productOptionsService = unit;
  });

  it('should be defined', () => {
    expect(productOptionsService).toBeDefined();
  });
});
