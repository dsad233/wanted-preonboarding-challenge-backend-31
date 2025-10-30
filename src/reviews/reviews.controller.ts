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
import { ReqUser } from 'src/common/decorators/user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 상품 리뷰 수정
  @UseInterceptors(TransactionInterceptor)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @ReqUser() userId: string,
    @Body() updateProductReviewDto: UpdateProductReviewDto,
  ): Promise<object> {
    return await this.reviewsService.update(id, userId, updateProductReviewDto);
  }

  // 상품 리뷰 삭제
  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @ReqUser() userId: string,
  ): Promise<object> {
    return await this.reviewsService.delete(id, userId);
  }
}
