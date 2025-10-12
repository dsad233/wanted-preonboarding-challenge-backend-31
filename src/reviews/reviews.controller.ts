import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateProductReviewDto } from 'src/products/dto/updateProductDto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 상품 리뷰 수정
  @UseInterceptors(TransactionInterceptor)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductReviewDto: UpdateProductReviewDto,
  ): Promise<object> {
    return await this.reviewsService.update(id, updateProductReviewDto);
  }

  // 상품 리뷰 삭제
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<object> {
    return await this.reviewsService.delete(id);
  }
}
