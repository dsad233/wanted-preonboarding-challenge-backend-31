import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JwtService as _JwtService,
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/jwt.payload.interface';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: _JwtService,
    private readonly configService: ConfigService,
  ) {}

  // access 토큰 생성
  async jwtSign(data: object, secretKey: string): Promise<string> {
    const sign = await this.jwtService.signAsync(data, {
      secret: secretKey,
      expiresIn: this.configService.getOrThrow<string>('jwt.exp'),
    });
    return sign;
  }

  // refresh 토큰 생성
  async jwtRefreshSign(
    data: object,
    refreshSecretKey: string,
  ): Promise<string> {
    const sign = await this.jwtService.signAsync(data, {
      secret: refreshSecretKey,
      expiresIn: this.configService.getOrThrow<string>('jwt.refreshExp'),
    });
    return sign;
  }

  // 토큰 검증
  async tokenVerify(data: string, secretKey: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verify(data, { secret: secretKey });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new HttpException('TokenExpiredError', HttpStatus.UNAUTHORIZED);
      } else if (err instanceof NotBeforeError) {
        throw new HttpException('NotBeforeError', HttpStatus.UNAUTHORIZED);
      } else if (err instanceof JsonWebTokenError) {
        throw new HttpException('JsonWebTokenError', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
