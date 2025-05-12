import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { CreateUserDto } from './dto/createUserDto';
import { EmailRegExp } from 'src/utils/utils';
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
  async createUser(createUserDto: CreateUserDto) {
    // 이메일 형식 체크
    if (!EmailRegExp.test(createUserDto.email)) {
      throw new HttpException('Not Form Email', HttpStatus.BAD_REQUEST);
    }

    // 이메일 중복 여부 검사
    const user = await this.authRepository.findOneUserEmail(
      createUserDto.email,
    );

    if (user?.email === createUserDto.email) {
      throw new HttpException('Already User Email', HttpStatus.BAD_REQUEST);
    }

    await this.authRepository.createUser(createUserDto);

    return { success: true, message: '유저 생성이 성공적으로 처리되었습니다.' };
  }

  // 로그인
  async signIn(loginUserDto: LoginUserDto) {
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

    const setSession = {
      ...user,
      accessToken: token,
      refreshToken: refreshToken,
    };

    await this.redisRepository.setex(
      `${user.id}:${user.email}`,
      60 * 60 * 60,
      JSON.stringify(setSession),
    );

    return { success: true, accessToken: token, refreshToken: refreshToken };
  }

  // 로그아웃
  async signOut(user: UserPayloadDto) {
    await this.redisRepository.del(`${user.id}:${user.email}`);
    return { success: true, message: '요청이 성공적으로 처리되었습니다.' };
  }
}
