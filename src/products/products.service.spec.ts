import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { TestBed } from '@automock/jest';

describe('ProductsService', () => {
  let productsService: ProductsService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductsService).compile();

    productsService = unit;
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });
});
