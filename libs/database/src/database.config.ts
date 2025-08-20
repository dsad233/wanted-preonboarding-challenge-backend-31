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
      // 이슈: https://github.com/typeorm/typeorm/issues/11224
      cache: {
        type: 'ioredis/cluster',
        options: {
          startupNodes: [
            {
              host: this.configService.getOrThrow<string>('redis.host'),
              port: Number(
                this.configService.getOrThrow<number>('redis.masterPort'),
              ),
            },
          ],
          options: {
            scaleReads: 'slave',
            retryDelayOnMoved: 100,
            slotsRefreshTimeout: 1000,
            slotsRefreshInterval: 5000,
            redisOptions: {
              password: this.configService.getOrThrow<string>('redis.pass'),
              maxRetriesPerRequest: 3,
            },
            natMap: {
              [`${this.configService.getOrThrow<string>('redis.masterHost')}:${this.configService.getOrThrow<string>('redis.masterPort')}`]:
                {
                  host: this.configService.getOrThrow<string>('redis.host'),
                  port: Number(
                    this.configService.getOrThrow<number>('redis.masterPort'),
                  ),
                },
              [`${this.configService.getOrThrow<string>('redis.slave1Host')}:${this.configService.getOrThrow<string>('redis.slave1Port')}`]:
                {
                  host: this.configService.getOrThrow<string>('redis.host'),
                  port: Number(
                    this.configService.getOrThrow<number>('redis.slave1Port'),
                  ),
                },
              [`${this.configService.getOrThrow<string>('redis.slave2Host')}:${this.configService.getOrThrow<string>('redis.slave2Port')}`]:
                {
                  host: this.configService.getOrThrow<string>('redis.host'),
                  port: Number(
                    this.configService.getOrThrow<number>('redis.slave2Port'),
                  ),
                },
            },
          },
        },
      },
      // dropSchema: true,
      // synchronize: true,
    };
  }
}
