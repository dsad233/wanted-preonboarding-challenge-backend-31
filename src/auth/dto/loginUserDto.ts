import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto';

export class LoginUserDto extends PickType(CreateUserDto, ['name', 'email']) {}
