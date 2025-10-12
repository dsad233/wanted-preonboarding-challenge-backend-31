import Redis from 'ioredis';
import { RedisRepository } from './redis.repository';
import { TestBed } from '@automock/jest';

describe('redisRepository', () => {
  let redisRepository: RedisRepository;
  let redisClient: jest.Mocked<Redis>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(RedisRepository).compile();

    redisRepository = unit;
    redisClient = unitRef.get('RedisClient');

    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('onModuleDestroy Method', () => {
    it('onModuleDestroy Success', () => {
      jest.spyOn(redisClient, 'disconnect').mockReturnValue();

      redisRepository.onModuleDestroy();

      expect(redisClient.disconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('get Method', () => {
    it('get Success', async () => {
      const key = 'key';
      const getData = 'test';

      jest.spyOn(redisClient, 'get').mockResolvedValue(getData);

      const get = await redisRepository.get(key);

      expect(redisClient.get).toHaveBeenLastCalledWith(key);
      expect(redisClient.get).toHaveBeenCalledTimes(1);

      expect(get).toBe(getData);
    });
  });

  describe('set Method', () => {
    it('set Success', async () => {
      const key = 'key';
      const value = 'value';

      jest.spyOn(redisClient, 'set').mockResolvedValue('OK');
      await redisRepository.set(key, value);

      expect(redisClient.set).toHaveBeenCalledWith(key, value);
      expect(redisClient.set).toHaveBeenCalledTimes(1);
    });
  });

  describe('del Method', () => {
    it('del Success', async () => {
      const key = 'key';

      jest.spyOn(redisClient, 'del').mockResolvedValue(1);

      await redisRepository.del(key);

      expect(redisClient.del).toHaveBeenCalledWith(key);
      expect(redisClient.del).toHaveBeenCalledTimes(1);
    });
  });

  describe('setex Method', () => {
    it('setex Success', async () => {
      const key = 'key';
      const expiry = 10;
      const value = 'value';

      jest.spyOn(redisClient, 'setex').mockResolvedValue('OK');

      await redisRepository.setex(key, expiry, value);

      expect(redisClient.setex).toHaveBeenCalledWith(key, expiry, value);
      expect(redisClient.setex).toHaveBeenCalledTimes(1);
    });
  });
});
