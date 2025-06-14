import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/createUserDto';
import { EmailRegExp } from 'src/common/utils';
import { LoginUserDto } from './dto/loginUserDto';
import { RedisRepository } from 'src/redis/redis.repository';
import { JwtService } from 'src/jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { UserPayloadDto } from './dto/userPayloadDto';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private redisRepository: RedisRepository,
  ) {}

  // 유저 생성
  async createUser(createUserDto: CreateUserDto): Promise<object> {
    // 이메일 형식 체크
    if (!EmailRegExp.test(createUserDto.email)) {
      throw new HttpException('Not Form Email', HttpStatus.BAD_REQUEST);
    }

    // 이메일 중복 여부 검사
    const user = await this.authRepository.findOneUserEmail(
      createUserDto.email,
    );

    if (user) {
      throw new HttpException('Already User Email', HttpStatus.BAD_REQUEST);
    }

    await this.authRepository.createUser(createUserDto);

    return { success: true, message: '유저 생성이 성공적으로 처리되었습니다.' };
  }

  // 로그인
  async signIn(loginUserDto: LoginUserDto): Promise<object> {
    const user = await this.authRepository.findOneUserEmail(loginUserDto.email);

    if (!user) {
      throw new HttpException('Not Found User', HttpStatus.BAD_REQUEST);
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.jwtService.jwtSign(
      payload,
      this.configService.getOrThrow<string>('jwt.secret'),
    );

    const refreshToken = await this.jwtService.jwtRefreshSign(
      payload,
      this.configService.getOrThrow<string>('jwt.refreshSecret'),
    );

    const accessTokenSession = {
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken: token,
    };

    const refreshTokenSession = {
      id: user.id,
      email: user.email,
      name: user.name,
      refreshToken: refreshToken,
    };

    // acessToken 설정
    await this.redisRepository.setex(
      `ACCESS:${user.id}:${user.email}`,
      this.configService.getOrThrow<number>('jwt.tokenTtl'),
      JSON.stringify(accessTokenSession),
    );

    // refreshToken 설정
    await this.redisRepository.setex(
      `REFRESH:${user.id}:${user.email}`,
      this.configService.getOrThrow<number>('jwt.refreshTokenTtl'),
      JSON.stringify(refreshTokenSession),
    );

    return { success: true, accessToken: token, refreshToken: refreshToken };
  }

  // 토큰 재발급
  async reissueToken(user: UserPayloadDto): Promise<object> {
    const getSession = await this.redisRepository.get(
      `REFRESH:${user.id}:${user.email}`,
    );
    if (!getSession) {
      throw new HttpException('Not Found User', HttpStatus.BAD_REQUEST);
    }

    await this.jwtService.tokenVerify(
      JSON.parse(getSession).refreshToken,
      this.configService.getOrThrow<string>('jwt.refreshSecret'),
    );

    const userData = await this.authRepository.findOneUserEmail(user.email);
    if (!userData) {
      throw new HttpException('Not Found User', HttpStatus.BAD_REQUEST);
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.jwtService.jwtSign(
      payload,
      this.configService.getOrThrow<string>('jwt.secret'),
    );

    const refreshToken = await this.jwtService.jwtRefreshSign(
      payload,
      this.configService.getOrThrow<string>('jwt.refreshSecret'),
    );

    const accessTokenSession = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      accessToken: token,
    };

    const refreshTokenSession = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      refreshToken: refreshToken,
    };

    // 기존 세션 삭제
    await this.redisRepository.del(`ACCESS:${user.id}:${user.email}`);
    await this.redisRepository.del(`REFRESH:${user.id}:${user.email}`);
    // 새로운 세션 설정
    await this.redisRepository.setex(
      `ACCESS:${user.id}:${user.email}`,
      this.configService.getOrThrow<number>('jwt.tokenTtl'),
      JSON.stringify(accessTokenSession),
    );

    await this.redisRepository.setex(
      `REFRESH:${user.id}:${user.email}`,
      this.configService.getOrThrow<number>('jwt.refreshTokenTtl'),
      JSON.stringify(refreshTokenSession),
    );

    return { success: true, accessToken: token, refreshToken: refreshToken };
  }

  // 로그아웃
  async signOut(user: UserPayloadDto): Promise<object> {
    await this.redisRepository.del(`ACCESS:${user.id}:${user.email}`);
    await this.redisRepository.del(`REFRESH:${user.id}:${user.email}`);
    return { success: true, message: '요청이 성공적으로 처리되었습니다.' };
  }
}
