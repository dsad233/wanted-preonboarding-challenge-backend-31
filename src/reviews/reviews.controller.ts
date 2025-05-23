import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateProductReviewDto } from 'src/products/dto/updateProductDto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 상품 리뷰 수정
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductReviewDto: UpdateProductReviewDto,
  ): Promise<object> {
    return await this.reviewsService.update(id, updateProductReviewDto);
  }

  // 상품 리뷰 삭제
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return await this.reviewsService.delete(id);
  }
}
