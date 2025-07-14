import { TestBed } from '@automock/jest';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './jwt.service';
import {
  JwtService as _JwtService,
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/jwt.payload.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('jwtService', () => {
  let jwtService: JwtService;
  let _jwtService: jest.Mocked<_JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(JwtService).compile();

    jwtService = unit;
    _jwtService = unitRef.get(_JwtService);
    configService = unitRef.get(ConfigService);

    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  describe('[access 토큰 생성] Method', () => {
    it('[access 토큰 생성] Success', async () => {
      const data = {
        id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
        email: 'test@naver.com',
      };
      const secretKey = 'key';
      const exp = 10;

      jest.spyOn(configService, 'getOrThrow').mockReturnValue(exp);

      const newAccessToken = 'accessToken';
      jest.spyOn(_jwtService, 'signAsync').mockResolvedValue(newAccessToken);

      const token = await jwtService.jwtSign(data, secretKey);

      expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.exp');
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);

      expect(_jwtService.signAsync).toHaveBeenCalledWith(data, {
        secret: secretKey,
        expiresIn: exp,
      });
      expect(_jwtService.signAsync).toHaveBeenCalledTimes(1);

      expect(token).toBe(newAccessToken);
    });
  });

  describe('[refresh 토큰 생성] Method', () => {
    it('[refresh 토큰 생성] Success', async () => {
      const data = {
        id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
        email: 'test@naver.com',
      };
      const refreshSecretKey = 'key';
      const exp = 10;

      jest.spyOn(configService, 'getOrThrow').mockReturnValue(exp);

      const newRefreshToken = 'refreshToken';
      jest.spyOn(_jwtService, 'signAsync').mockResolvedValue(newRefreshToken);

      const token = await jwtService.jwtRefreshSign(data, refreshSecretKey);

      expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.refreshExp');
      expect(configService.getOrThrow).toHaveBeenCalledTimes(1);

      expect(_jwtService.signAsync).toHaveBeenCalledWith(data, {
        secret: refreshSecretKey,
        expiresIn: exp,
      });
      expect(_jwtService.signAsync).toHaveBeenCalledTimes(1);

      expect(token).toBe(newRefreshToken);
    });
  });

  describe('[토큰 검증] Method', () => {
    it('[토큰 검증] Success', async () => {
      const token = 'accessToken';
      const secretKey = 'key';

      const verify: JwtPayload = {
        id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
        email: 'test@naver.com',
        iat: 1750944295,
        exp: 1750969495,
      };

      jest.spyOn(_jwtService, 'verify').mockReturnValue(verify);

      const tokenVerify = await jwtService.tokenVerify(token, secretKey);

      expect(_jwtService.verify).toHaveBeenCalledWith(token, {
        secret: secretKey,
      });
      expect(_jwtService.verify).toHaveBeenCalledTimes(1);

      expect(tokenVerify).toEqual(verify);
    });

    it('[토큰 검증] Unauthorized', async () => {
      const token = 'accessToken';
      const secretKey = 'key';

      jest.spyOn(_jwtService, 'verify').mockImplementationOnce(() => {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      });

      try {
        await jwtService.tokenVerify(token, secretKey);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(
          HttpStatus.UNAUTHORIZED,
        );
        expect((err as HttpException).getResponse()).toBe('Unauthorized');
      }
    });

    it('[토큰 검증] TokenExpiredError', async () => {
      const token = 'accessToken';
      const secretKey = 'key';

      jest.spyOn(_jwtService, 'verify').mockImplementationOnce(() => {
        throw new TokenExpiredError('TokenExpiredError', new Date());
      });

      try {
        await jwtService.tokenVerify(token, secretKey);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(
          HttpStatus.UNAUTHORIZED,
        );
        expect((err as HttpException).getResponse()).toBe('TokenExpiredError');
      }
    });

    it('[토큰 검증] NotBeforeError', async () => {
      const token = 'accessToken';
      const secretKey = 'key';

      jest.spyOn(_jwtService, 'verify').mockImplementationOnce(() => {
        throw new NotBeforeError('NotBeforeError', new Date());
      });

      try {
        await jwtService.tokenVerify(token, secretKey);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(
          HttpStatus.UNAUTHORIZED,
        );
        expect((err as HttpException).getResponse()).toBe('NotBeforeError');
      }
    });

    it('[토큰 검증] JsonWebTokenError', async () => {
      const token = 'accessToken';
      const secretKey = 'key';

      jest.spyOn(_jwtService, 'verify').mockImplementationOnce(() => {
        throw new JsonWebTokenError('JsonWebTokenError');
      });

      try {
        await jwtService.tokenVerify(token, secretKey);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(
          HttpStatus.UNAUTHORIZED,
        );
        expect((err as HttpException).getResponse()).toBe('JsonWebTokenError');
      }
    });
  });
});
