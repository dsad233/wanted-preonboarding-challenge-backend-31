import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
  Brand,
  Category,
  Product,
  ProductCategory,
  ProductDetail,
  ProductImage,
  ProductOption,
  ProductOptionGroup,
  ProductPrice,
  ProductTag,
  Review,
  Seller,
  Tag,
  User,
} from '@libs/database/entities';
import SnakeNamingStrategy from 'typeorm-naming-strategy';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      username: this.configService.getOrThrow<string>('database.user'),
      password: this.configService.getOrThrow<string>('database.pass'),
      port: this.configService.getOrThrow<number>('database.port'),
      host: this.configService.getOrThrow<string>('database.host'),
      database: this.configService.getOrThrow<string>('database.name'),
      poolSize: this.configService.getOrThrow<number>('database.poolSize'),
      namingStrategy: new SnakeNamingStrategy(),
      entities: [
        Brand,
        Category,
        ProductCategory,
        ProductDetail,
        ProductImage,
        ProductOptionGroup,
        ProductOption,
        ProductPrice,
        ProductTag,
        Product,
        Review,
        Seller,
        Tag,
        User,
      ],
      // dropSchema: true,
      // synchronize: true,
    };
  }
}
