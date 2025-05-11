import { RedisConfig } from 'src/redis/redis.config';
import { Module } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Module({
  providers: [RedisConfig, RedisRepository],
  exports: [RedisConfig, RedisRepository],
})
export class RedisModule {}
