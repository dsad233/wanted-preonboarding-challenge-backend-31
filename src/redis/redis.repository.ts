import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Cluster } from 'ioredis';

// 참조: https://medium.com/@akintobiidris/using-redis-client-in-nestjs-3fe80eb91a49
@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redisClient: Cluster) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(`${key}`);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(`${key}`, value);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(`${key}`);
  }

  async setex(key: string, expiry: number, value: string): Promise<void> {
    await this.redisClient.setex(`${key}`, expiry, value);
  }
}
