import { Module } from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { ProductOptionsController } from './product-options.controller';
import { ProductOptionsRepository } from './product-options.repository';

@Module({
  controllers: [ProductOptionsController],
  providers: [ProductOptionsService, ProductOptionsRepository],
})
export class ProductOptionsModule {}
