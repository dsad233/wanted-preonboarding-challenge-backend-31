import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDto';
import { LoginUserDto } from './dto/loginUserDto';
import { ReqUser } from 'src/utils/decorators/user.decorator';
import { UserPayloadDto } from './dto/userPayloadDto';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Public } from 'src/utils/decorators/ispublic.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 유저 생성
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<object> {
    return await this.authService.createUser(createUserDto);
  }

  // 로그인
  @Public()
  @Post('/signin')
  async signIn(@Body() loginUserDto: LoginUserDto): Promise<object> {
    return await this.authService.signIn(loginUserDto);
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
