import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDto';
import { LoginUserDto } from './dto/loginUserDto';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { UserPayloadDto } from './dto/userPayloadDto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Public } from 'src/common/decorators/ispublic.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 유저 생성
  @Throttle({ default: { limit: 10, ttl: 10000 } })
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<object> {
    return await this.authService.createUser(createUserDto);
  }

  // 로그인
  @Throttle({ default: { limit: 5, ttl: 1000 } })
  @Public()
  @Post('/signin')
  async signIn(@Body() loginUserDto: LoginUserDto): Promise<object> {
    return await this.authService.signIn(loginUserDto);
  }

  // 토큰 재발급
  @Post('/reissue')
  async reissueToken(@ReqUser() payload: UserPayloadDto): Promise<object> {
    const user = plainToClass(UserPayloadDto, payload, {
      excludeExtraneousValues: true,
    });
    await validateOrReject(user);
    return await this.authService.reissueToken(user);
  }

  // 로그아웃
  @Post('/signout')
  async signOut(@ReqUser() payload: UserPayloadDto): Promise<object> {
    const user = plainToClass(UserPayloadDto, payload, {
      excludeExtraneousValues: true,
    });
    await validateOrReject(user);
    return await this.authService.signOut(user);
  }
}
