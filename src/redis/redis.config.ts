import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const RedisConfig: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: (configService: ConfigService) => {
    const redisInstance = new Redis({
      host: configService.getOrThrow<string>('redis.host'),
      port: Number(configService.getOrThrow<number>('redis.port')),
      db: Number(configService.getOrThrow<number>('redis.db')),
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [ConfigService],
};
