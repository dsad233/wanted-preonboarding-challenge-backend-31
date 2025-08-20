import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cluster } from 'ioredis';

export const RedisConfig: FactoryProvider<Cluster> = {
  provide: 'RedisClient',
  useFactory: (configService: ConfigService) => {
    const redisInstance = new Cluster(
      [
        {
          host: configService.getOrThrow<string>('redis.host'),
          port: Number(configService.getOrThrow<number>('redis.masterPort')),
        },
      ],
      {
        retryDelayOnMoved: 100,
        slotsRefreshTimeout: 1000,
        slotsRefreshInterval: 5000,
        redisOptions: {
          password: configService.getOrThrow<string>('redis.pass'),
          maxRetriesPerRequest: 3,
        },
        natMap: {
          [`${configService.getOrThrow<string>('redis.masterHost')}:${configService.getOrThrow<string>('redis.masterPort')}`]:
            {
              host: configService.getOrThrow<string>('redis.host'),
              port: Number(
                configService.getOrThrow<number>('redis.masterPort'),
              ),
            },
          [`${configService.getOrThrow<string>('redis.slave1Host')}:${configService.getOrThrow<string>('redis.slave1Port')}`]:
            {
              host: configService.getOrThrow<string>('redis.host'),
              port: Number(
                configService.getOrThrow<number>('redis.slave1Port'),
              ),
            },
          [`${configService.getOrThrow<string>('redis.slave2Host')}:${configService.getOrThrow<string>('redis.slave2Port')}`]:
            {
              host: configService.getOrThrow<string>('redis.host'),
              port: Number(
                configService.getOrThrow<number>('redis.slave2Port'),
              ),
            },
        },
      },
    );

    redisInstance.on('connect', () => {
      console.log('Redis Connect.');
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [ConfigService],
};
