import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { RedisRepository } from '../redis/redis.repository';
import { JwtService } from '../jwt/jwt.service';
import { TestBed } from '@automock/jest';
import { CreateUserDto } from './dto/createUserDto';
import { User } from '@libs/database/entities';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserPayloadDto } from './dto/userPayloadDto';
import { LoginUserDto } from './dto/loginUserDto';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let configService: jest.Mocked<ConfigService>;
  let redisRepository: jest.Mocked<RedisRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();

    authService = unit;
    authRepository = unitRef.get(AuthRepository);
    configService = unitRef.get(ConfigService);
    redisRepository = unitRef.get(RedisRepository);
    jwtService = unitRef.get(JwtService);

    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  describe('[유저 생성] createUser Method', () => {
    it('[유저 생성] createUser Success', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@naver.com',
        avatarUrl: 'http://test.com',
      };

      jest
        .spyOn(authRepository, 'findOneUserEmail')
        .mockResolvedValue(undefined);
      jest.spyOn(authRepository, 'createUser').mockResolvedValue();

      const create = await authService.createUser(createUserDto);

      expect(authRepository.findOneUserEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(authRepository.findOneUserEmail).toHaveBeenCalledTimes(1);

      expect(authRepository.createUser).toHaveBeenCalledWith(createUserDto);
      expect(authRepository.createUser).toHaveBeenCalledTimes(1);

      expect(create).toEqual({
        success: true,
        message: '유저 생성이 성공적으로 처리되었습니다.',
      });
    });

    it('[유저 생성] createUser Email Form Error', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'failTest',
        avatarUrl: 'http://test.com',
      };

      try {
        await authService.createUser(createUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect((err as HttpException).getResponse()).toBe('Not Form Email');
      }
    });

    it('[유저 생성] createUser Already Email Error', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test1',
        email: 'test@naver.com',
        avatarUrl: 'http://test.com',
      };

      const user: User = {
        id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
        name: 'test',
        email: 'test@naver.com',
        avatarUrl: 'http://test1.com',
        createdAt: new Date(),
        reviews: [],
      };

      jest.spyOn(authRepository, 'findOneUserEmail').mockResolvedValue(user);

      try {
        await authService.createUser(createUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect((err as HttpException).getResponse()).toBe('Already User Email');
      }
    });

    describe('[로그인] signIn Method', () => {
      it('[로그인] signIn Success', async () => {
        const loginDto: LoginUserDto = {
          name: 'test',
          email: 'test@naver.com',
        };

        const user: User = {
          id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
          name: 'test',
          email: 'test@naver.com',
          avatarUrl: 'http://test1.com',
          createdAt: new Date(),
          reviews: [],
        };

        const accessToken = 'accessToken';
        const accessTokenSecretKey = 'accessSecret';
        const accessTokenTtl = 10;
        const refreshToken = 'refreshToken';
        const refreshTokenSecretKey = 'refreshSecret';
        const refreshTokenTtl = 15;

        const newPayload = {
          id: user.id,
          email: user.email,
        };

        const accessTokenSession = {
          id: user.id,
          email: user.email,
          name: user.name,
          accessToken: accessToken,
        };

        const refreshTokenSession = {
          id: user.id,
          email: user.email,
          name: user.name,
          refreshToken: refreshToken,
        };

        jest.spyOn(authRepository, 'findOneUserEmail').mockResolvedValue(user);

        jest.spyOn(jwtService, 'jwtSign').mockResolvedValue(accessToken);
        jest
          .spyOn(jwtService, 'jwtRefreshSign')
          .mockResolvedValue(refreshToken);

        jest
          .spyOn(redisRepository, 'setex')
          .mockResolvedValue()
          .mockResolvedValue();

        jest.spyOn(configService, 'getOrThrow').mockImplementation((data) => {
          if (data === 'jwt.refreshSecret') {
            return refreshTokenSecretKey;
          } else if (data === 'jwt.secret') {
            return accessTokenSecretKey;
          } else if (data === 'jwt.tokenTtl') {
            return accessTokenTtl;
          } else if (data === 'jwt.refreshTokenTtl') {
            return refreshTokenTtl;
          }
        });

        const signIn = await authService.signIn(loginDto);

        expect(authRepository.findOneUserEmail).toHaveBeenCalledWith(
          loginDto.email,
        );
        expect(authRepository.findOneUserEmail).toHaveBeenCalledTimes(1);

        expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.secret');
        expect(jwtService.jwtSign).toHaveBeenCalledWith(
          newPayload,
          accessTokenSecretKey,
        );
        expect(jwtService.jwtSign).toHaveBeenCalledTimes(1);

        expect(configService.getOrThrow).toHaveBeenCalledWith(
          'jwt.refreshSecret',
        );
        expect(jwtService.jwtRefreshSign).toHaveBeenCalledWith(
          newPayload,
          refreshTokenSecretKey,
        );
        expect(jwtService.jwtRefreshSign).toHaveBeenCalledTimes(1);

        expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.tokenTtl');
        expect(configService.getOrThrow).toHaveBeenCalledWith(
          'jwt.refreshTokenTtl',
        );
        expect(redisRepository.setex).toHaveBeenCalledWith(
          `ACCESS:${user.id}:${user.email}`,
          accessTokenTtl,
          JSON.stringify(accessTokenSession),
        );
        expect(redisRepository.setex).toHaveBeenCalledWith(
          `REFRESH:${user.id}:${user.email}`,
          refreshTokenTtl,
          JSON.stringify(refreshTokenSession),
        );
        expect(redisRepository.setex).toHaveBeenCalledTimes(2);

        expect(signIn).toEqual({
          success: true,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      });

      it('[로그인] signIn User Not Found Error', async () => {
        const loginDto: LoginUserDto = {
          name: 'test',
          email: 'test@naver.com',
        };
        jest
          .spyOn(authRepository, 'findOneUserEmail')
          .mockResolvedValue(undefined);

        try {
          await authService.signIn(loginDto);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect((err as HttpException).getStatus()).toBe(
            HttpStatus.BAD_REQUEST,
          );
          expect((err as HttpException).getResponse()).toBe('Not Found User');
        }
      });
    });

    describe('[토큰 재발급] reissueToken Method', () => {
      it('[토큰 재발급] reissueToken Success', async () => {
        const session = {
          id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
          name: 'test',
          email: 'test@naver.com',
          refreshToken: 'refreshToken',
        };

        const payloadDto: UserPayloadDto = {
          id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
          email: 'test@naver.com',
        };

        const user: User = {
          id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
          name: 'test',
          email: 'test@naver.com',
          avatarUrl: 'http://test.com',
          createdAt: new Date(),
          reviews: [],
        };

        const verify = {
          id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
          email: 'test@naver.com',
          iat: 1750944295,
          exp: 1750969495,
        };

        const newPayload = {
          id: user.id,
          email: user.email,
        };

        const newAccessToken = 'newAccessToken';
        const accessTokenSecretKey = 'accessSecret';
        const accessTokenTtl = 10;
        const newRefreshToken = 'newRefreshToken';
        const refreshTokenSecretKey = 'refreshSecret';
        const refreshTokenTtl = 15;

        const accessTokenSession = {
          id: user.id,
          email: user.email,
          name: user.name,
          accessToken: newAccessToken,
        };

        const refreshTokenSession = {
          id: user.id,
          email: user.email,
          name: user.name,
          refreshToken: newRefreshToken,
        };

        jest
          .spyOn(redisRepository, 'get')
          .mockResolvedValue(JSON.stringify(session));
        jest.spyOn(jwtService, 'tokenVerify').mockResolvedValue(verify);
        jest.spyOn(authRepository, 'findOneUserEmail').mockResolvedValue(user);

        jest.spyOn(jwtService, 'jwtSign').mockResolvedValue(newAccessToken);
        jest
          .spyOn(jwtService, 'jwtRefreshSign')
          .mockResolvedValue(newRefreshToken);

        jest.spyOn(configService, 'getOrThrow').mockImplementation((data) => {
          if (data === 'jwt.refreshSecret') {
            return refreshTokenSecretKey;
          } else if (data === 'jwt.secret') {
            return accessTokenSecretKey;
          } else if (data === 'jwt.tokenTtl') {
            return accessTokenTtl;
          } else if (data === 'jwt.refreshTokenTtl') {
            return refreshTokenTtl;
          }
        });

        jest
          .spyOn(redisRepository, 'del')
          .mockResolvedValue()
          .mockResolvedValue();
        jest
          .spyOn(redisRepository, 'setex')
          .mockResolvedValue()
          .mockResolvedValue();

        const reissue = await authService.reissueToken(payloadDto);

        expect(redisRepository.get).toHaveBeenCalledWith(
          `REFRESH:${payloadDto.id}:${payloadDto.email}`,
        );
        expect(redisRepository.get).toHaveBeenCalledTimes(1);

        expect(configService.getOrThrow).toHaveBeenCalledWith(
          'jwt.refreshSecret',
        );
        expect(jwtService.tokenVerify).toHaveBeenCalledWith(
          JSON.parse(JSON.stringify(session)).refreshToken,
          refreshTokenSecretKey,
        );
        expect(jwtService.tokenVerify).toHaveBeenCalledTimes(1);

        expect(authRepository.findOneUserEmail).toHaveBeenCalledWith(
          verify.email,
        );
        expect(authRepository.findOneUserEmail).toHaveBeenCalledTimes(1);

        expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.secret');
        expect(jwtService.jwtSign).toHaveBeenCalledWith(
          newPayload,
          accessTokenSecretKey,
        );
        expect(jwtService.jwtSign).toHaveBeenCalledTimes(1);

        expect(configService.getOrThrow).toHaveBeenCalledWith(
          'jwt.refreshSecret',
        );
        expect(jwtService.jwtRefreshSign).toHaveBeenCalledWith(
          newPayload,
          refreshTokenSecretKey,
        );
        expect(jwtService.jwtRefreshSign).toHaveBeenCalledTimes(1);

        expect(redisRepository.del).toHaveBeenCalledWith(
          `ACCESS:${user.id}:${user.email}`,
        );
        expect(redisRepository.del).toHaveBeenCalledWith(
          `REFRESH:${user.id}:${user.email}`,
        );
        expect(redisRepository.del).toHaveBeenCalledTimes(2);

        expect(configService.getOrThrow).toHaveBeenCalledWith('jwt.tokenTtl');
        expect(configService.getOrThrow).toHaveBeenCalledWith(
          'jwt.refreshTokenTtl',
        );
        expect(redisRepository.setex).toHaveBeenCalledWith(
          `ACCESS:${user.id}:${user.email}`,
          accessTokenTtl,
          JSON.stringify(accessTokenSession),
        );
        expect(redisRepository.setex).toHaveBeenCalledWith(
          `REFRESH:${user.id}:${user.email}`,
          refreshTokenTtl,
          JSON.stringify(refreshTokenSession),
        );
        expect(redisRepository.setex).toHaveBeenCalledTimes(2);

        expect(reissue).toEqual({
          success: true,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      });

      it('[토큰 재발급] reissueToken Redis User Not Found Error', async () => {
        const payloadDto: UserPayloadDto = {
          id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
          email: 'test@naver.com',
        };

        jest.spyOn(redisRepository, 'get').mockResolvedValue(undefined);

        try {
          await authService.reissueToken(payloadDto);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect((err as HttpException).getStatus()).toBe(
            HttpStatus.BAD_REQUEST,
          );
          expect((err as HttpException).getResponse()).toBe('Not Found User');
        }
      });

      it('[토큰 재발급] reissueToken DB User Not Found Error', async () => {
        const payloadDto: UserPayloadDto = {
          id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
          email: 'test@naver.com',
        };

        jest.spyOn(redisRepository, 'get').mockResolvedValue(undefined);
        jest
          .spyOn(authRepository, 'findOneUserEmail')
          .mockResolvedValue(undefined);

        try {
          await authService.reissueToken(payloadDto);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect((err as HttpException).getStatus()).toBe(
            HttpStatus.BAD_REQUEST,
          );
          expect((err as HttpException).getResponse()).toBe('Not Found User');
        }
      });
    });

    describe('[로그아웃] signOut Method', () => {
      it('[로그아웃] signOut Success', async () => {
        const payloadDto: UserPayloadDto = {
          id: 'a7bdd689-2c30-4351-8a96-acdabc216d66',
          email: 'test@naver.com',
        };

        jest
          .spyOn(redisRepository, 'del')
          .mockResolvedValue()
          .mockResolvedValue();

        const signOut = await authService.signOut(payloadDto);

        expect(redisRepository.del).toHaveBeenCalledWith(
          `ACCESS:${payloadDto.id}:${payloadDto.email}`,
        );
        expect(redisRepository.del).toHaveBeenCalledWith(
          `REFRESH:${payloadDto.id}:${payloadDto.email}`,
        );
        expect(redisRepository.del).toHaveBeenCalledTimes(2);

        expect(signOut).toEqual({
          success: true,
          message: '요청이 성공적으로 처리되었습니다.',
        });
      });
    });
  });
});
