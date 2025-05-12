import { Injectable } from '@nestjs/common';
import { JwtService as _JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: _JwtService) {}

  // access 토큰 생성
  async jwtSign(data: object, secretKey: string): Promise<string> {
    const sign = await this.jwtService.signAsync(data, {
      secret: secretKey,
      expiresIn: '1h',
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
      expiresIn: '7d',
    });
    return sign;
  }
}
