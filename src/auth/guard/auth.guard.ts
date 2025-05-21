import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from 'src/jwt/jwt.service';
import { IS_PUBLIC_KEY } from 'src/utils/decorators/ispublic.decorator';
import { REQUEST_USER_KEY } from 'src/utils/decorators/user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

    const verify = await this.jwtService.tokenVerify(
      token,
      this.configService.getOrThrow<string>('jwt.secret'),
    );

    request[REQUEST_USER_KEY] = { id: verify.id, email: verify.email };
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
