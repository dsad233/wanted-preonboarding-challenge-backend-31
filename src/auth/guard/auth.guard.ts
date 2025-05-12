import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RedisRepository } from 'src/redis/redis.repository';
import { IS_PUBLIC_KEY } from 'src/utils/decorators/ispublic.decorator';
import { REQUEST_USER_KEY } from 'src/utils/decorators/user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisRepository: RedisRepository,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const verify = this.jwtService.verify(token, {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
    });

    const getSession = await this.redisRepository.get(
      `${verify.id}:${verify.email}`,
    );
    if (!getSession) {
      throw new HttpException('Not Found User', HttpStatus.BAD_REQUEST);
    }

    const { accessToken, refreshToken, ...user } = JSON.parse(getSession);

    request[REQUEST_USER_KEY] = user;
    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type?.toLowerCase() !== 'bearer') {
      return;
    }

    return token;
  }
}
